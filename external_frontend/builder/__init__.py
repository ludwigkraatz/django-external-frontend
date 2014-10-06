import os
import sys
import shutil
import json
import logging
import shutil
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from ..utils.dict import dict_merge
from ..settings import settings as externalFrontendSettings
import re
from django.utils.datastructures import SortedDict


class WrappedSource(str):
    def __new__(self, *args, **kwargs):
        return super(WrappedSource, self).__new__(self, args[0])

    def __init__(self, source, handler, method_map):
        super(WrappedSource, self).__init__(source)
        self.handler = handler
        self.method_map = method_map

    def export(self, destination, log=None):
        return self.method_map['export'](self.handler, destination)


wrappedGitMethodMap = {
    'export': lambda repo, destination: repo.index.checkout(
        force=True,
        prefix=os.path.realpath(destination) + os.path.sep
    )
}


def generate_handler(storages, builder, src, log, main_builder):
    class Handler(FileSystemEventHandler):
        def prepare_path(self, path):
            path = os.path.relpath(path, src)
            prefix = '.' + os.path.sep
            if path.startswith(prefix) and path.find(os.path.sep) > 1:
                path = path[2:]
            return path

        def on_created(self, event):
            if not event.is_directory and not (os.path.sep + '.') in event.src_path:
                with open(event.src_path, 'r') as content:
                    path = self.prepare_path(event.src_path)
                    log.write("Created: " + path)
                    builder.update(path=path, content=content.read(), storages=storages, log=log.with_indent(), main_builder=main_builder)

        def on_deleted(self, event):
            if not event.is_directory and not (os.path.sep + '.') in event.src_path:
                path = self.prepare_path(event.src_path)
                log.write("Removed: " + path)
                builder.remove(path=path, storages=storages, log=log.with_indent(), main_builder=main_builder)

        def on_moved(self, event):
            if not event.is_directory and not (os.path.sep + '.') in event.src_path:
                if (os.path.sep + '.') in event.dest_path:
                    path = self.prepare_path(event.dest_path)
                    log.write("Removed: " + path)
                    builder.remove(path=path, storages=storages, log=log.with_indent(), main_builder=main_builder)
                else:
                    with open(event.dest_path, 'r') as content:
                        path = self.prepare_path(event.src_path)
                        dest_path = self.prepare_path(event.dest_path)
                        log.write("Moved: " + path + ' to ' + dest_path)
                        builder.remove(path=path, storages=storages, log=log.with_indent())
                        builder.update(path=dest_path, content=content.read(), storages=storages, log=log.with_indent(), main_builder=main_builder)

        def on_modified(self, event):
            if not event.is_directory and not (os.path.sep + '.') in event.src_path:
                with open(event.src_path, 'r') as content:
                    path = self.prepare_path(event.src_path)
                    log.write("Modified: " + path)
                    builder.update(path=path, content=content.read(), storages=storages, log=log.with_indent(), main_builder=main_builder)

    return Handler()


class FrontendBuilder(object):
    """
    the FrontendBuilder does exactly what it's name says:
    it builds the frontend from sources

    A Mapper object tells it what changed and the Builder then apply the
    resulting changes and (re)build the frontend
    """
    src = None
    storage = None
    current_stage = None

    # the source map tells the builder, which files are dependent on which sources
    source_map = None

    def __init__(self, settings=None):
        self.name = settings.NAME
        self.src_name = settings.SRC_NAME or self.name
        self._config = settings.CONFIG
        self.debug = settings.DEBUG
        self.type = settings.TYPE
        self.filter = settings.FILTER

        self.cache_dir = (externalFrontendSettings.CACHE_ROOT + os.path.sep + 'external_frontend.cache')
        self.cache_dir_remote = self.cache_dir + os.path.sep + 'remote' + os.path.sep + self.name

        self.cache_dir_src = self.cache_dir + os.path.sep + 'src'
        self.cache_dir_frontend = self.cache_dir_src + os.path.sep + self.name
        self.cache_dir_build = self.cache_dir + os.path.sep + 'build' + self.name
        self.cache_dir_built_css = self.cache_dir_build + os.path.sep + 'css' + self.name
        self.cache_dir_built_js = self.cache_dir_build + os.path.sep + 'js' + self.name
        self.compile_dir = self.cache_dir + os.path.sep + 'compiled' + os.path.sep + self.name

        self.init_src(settings.SRC)
        self.src_real = os.path.realpath(self.src)

        self.reset_observer()

        def get_dependencies():
            #raise Exception(str(settings.__dict__['_dict']))
            #raise Exception(str([setting.NAME for setting in settings.DEPENDS_ON]))
            #raise Exception([str(setting) for setting in settings.DEPENDS_ON])
            return settings.DEPENDS_ON
        self.get_dependencies = get_dependencies
        self.dependency_map = {}

        self.source_map = {}
        self.css_vars = {}
        self.css_config = SortedDict()
        self.compiler_queues = SortedDict((
            ('js-config', SortedDict({None: SortedDict()})),
            ('css-config', SortedDict({None: SortedDict()})),
            ('sass', SortedDict({None: SortedDict()})),
            ('scss', SortedDict({None: SortedDict()})),
            ('css', SortedDict({None: SortedDict()})),
            #('img', SortedDict({None: SortedDict()})),
            ('js', SortedDict({None: SortedDict()})),
            #('html', SortedDict({None: SortedDict()})),
        ))
        # default
        self.config = {
            'unversioned': [],
            'staging': {
                'filtered_files': [],
                'debug': {
                    'exclusive_files': []
                }
            }
        }
        self.css_sources = SortedDict()

    def init_src(self, source):
        if source.startswith('git@') or (source.startswith('https://') and '.git' in source):  # TODO: debug output (cloned to local repo / updated local repo)
            from git import *

            commit = None
            if '@' in source.split(':')[-1]:
                parts = source.split('@')
                source = '@'.join(parts[0:-1])
                commit = parts[-1]

            if not os.path.exists(self.cache_dir_remote + os.path.sep + '.git'):
                repo = Repo.clone_from(source, self.cache_dir_remote)
            else:
                repo = Repo(self.cache_dir_remote)
                if commit:
                    branches = repo.git.execute(['git', 'branch', '--contains', commit])
                    branch = branches.split('\n')[-1].strip()
                    branch = branches.split(' ')[-1] if ' ' in branch else branch
                else:
                    branch = 'master'

                repo.git.checkout(branch)  # TODO: is this the right/best way?
                #repo.remotes.origin.pull(branch)

            if commit:  # TODO: this is not always working? maybe always checkout branch first?
                repo.git.checkout(commit)

            self.src = WrappedSource(self.cache_dir_remote, repo, wrappedGitMethodMap)
        else:
            self.src = source

        if not os.path.exists(self.src):
            raise Exception('FrontendBuilder need to be initialized with existing src directory.\
                        "%s" does not exist' % self.src)

    def run_dependencies(self, storages, update, log=None, main_builder=None): # obsolete
        main_builder = main_builder or self
        config = {}
        for dependency in self.get_dependencies():
            dependency_log = log.with_indent('loading dependency "%s"' % dependency)
            if dependency.run(storages=storages, log=dependency_log, main_builder=main_builder, update=update):
                self.set_default_config(dependency.config)
            else:
                log.write('couldn\'t build dependency "%s"' % dependency)
        return config

    def init_dependencies(self, main_builder=None, **config):
        main_builder.dependency_map[self.name] = self
        for dependency in self.get_dependencies():
            dependency.init_dependencies(main_builder=main_builder)

    def register_handler(self, event_handler):
        if self.observer is None:
            self.observer = Observer()
            self.observer.start()

        return self.observer.schedule(event_handler, self.src_real, recursive=True)

    def reset_observer(self):
        if hasattr(self, 'observer') and self.observer:
            self.observer.unschedule_all()
            self.observer.stop()
            self.observer.join()

        self.observer = None
        self.observers_watcher = {}

    def init_observers(self, **config):
        started = 0
        main_builder = config.get('main_builder', None)
        for dependency in self.get_dependencies():
            started += dependency.init_observers(**config)

        if main_builder in self.observers_watcher:
            return started

        if isinstance(self.src, WrappedSource):
            config['log'].write('skip starting observer for "%s" on %s, because its wrapped' % (self.name, self.src_real))
            return started

        handler = config.get('launcher')(
            config.get('storages'),
            self,
            self.src_real,
            log=config['log'].async(),
            main_builder=config.get('main_builder')
        )
        watcher = self.register_handler(handler)

        self.observers_watcher[config.get('main_builder', None)] = (handler, watcher)
        started += 1
        config['log'].write('started observer for "%s" on %s' % (self.name, self.src_real))
        return started

    def stop_watching(self, log, main_builder=None):
        main_builder = main_builder or self
        for dependency in self.get_dependencies():
            dependency.stop_watching(log=log, main_builder=main_builder)

        if main_builder in self.observers_watcher:
            self.observer.remove_handler_for_watch(*self.observers_watcher[main_builder])
            del self.observers_watcher[main_builder]
            log.write('remove watcher "%s"' % (self.name))
            if not self.observers_watcher:
                log.write('resetting', self.name)
                self.reset_observer()

    def watch(self, **config):
        config['watch'] = True
        log = config['log']
        if self.build(**config):
            return True
        else:
            log.write('no observers started, because build failed')
            return False

    def build(self, **config):
        """
        config:
            storages
            main_builder
            log
            watch
            skip_db
            update
        """
        if not 'main_builder' in config:
            config['main_builder'] = self
        log = config.get('log')

        if not os.path.exists(self.cache_dir_frontend):
            os.makedirs(self.cache_dir_frontend)

        self.clean(**config)
        #0 init dependencies
        #dependency_log = log.with_indent("init dependencies")
        self.init_dependencies(**config)

        #1 collect sources
        if config.get('update', True):  # or build cache = empty
            if not os.path.exists(self.cache_dir_remote):
                os.makedirs(self.cache_dir_remote)

            if not os.path.exists(self.cache_dir_built_css):
                os.makedirs(self.cache_dir_built_css)

            if not os.path.exists(self.cache_dir_built_js):
                os.makedirs(self.cache_dir_built_js)

            ## if needed, checkout git
            self.collect(**config)

        #2 init config file(s)
        try:
            self.load_config()
        except:
            config.get('log').write('config not loaded')
            return False

        #if not self.css_sources:
        #    raise Exception('currently build from cache without update is not possible')
        #print self.css_sources

        if ((not config.get('skip_db', True)) and config.get('update', True)):
            self.update_db(**config)

        #3 build

        # copy
        config['log'] = log.with_indent('copying', single_line=not self.debug)
        if not self.skip_db or config.get('skip_db', True):
            self.build_from_cache(**config)
        else:
            # load files to DB
            pass  # self.build_from_db(storages=storages, log=log, main_builder=self)

        # compile
        config['log'] = log.with_indent('compiling', single_line=not self.debug)
        if not os.path.exists(self.compile_dir):
            os.makedirs(self.compile_dir)
        self.compile(**config)

        # 4 observer
        if config.get('watch', False):
            started = self.init_observers(launcher=generate_handler, **config)
            observer_log = log.with_indent("%s observer started" % started)
        return True

    def get_config(self, *args, **kwargs):
        config = self.config
        default = kwargs.get('default', None)

        for arg in args:
            if arg in config:
                config = config.get(arg)
            else:
                return default
        return config

    def clean(self, storages, log=None, **config):
        if os.path.exists(self.compile_dir):
            shutil.rmtree(self.compile_dir)
        for path in os.listdir(self.cache_dir_src):
            path = os.path.join(self.cache_dir_src, path)
            if not os.path.islink(path) and os.path.isdir(path):
                shutil.rmtree(path)

    def get_frontend_config_dest_path(self):
        return self.get_config('configuration_file') or ('.' + os.path.sep + 'config.json')

    def get_frontend_config_path(self, folder=False):
        path = '.' + os.path.sep + 'external_frontend'
        extension = '.yml'

        if folder:
            return path + os.path.sep + 'config' + extension
        return path + extension

    def set_default_config(self, config):
        self.config = dict_merge(config, self.config)

    def load_data(self, storages, main_builder=None, log=None):
        raise Exception()
        log = log.with_indent('loading styles')
        for root, dirnames, filenames in os.walk(self.src):
            for path in filenames:
                path = os.path.join(os.path.relpath(root, self.src), path)
                if log:
                    log.write(path)
                with open(os.path.join(self.src, path), 'r') as content:
                    self.update(path, content.read(), storages=storages, log=log)

        self.update_configuration(storages, log=log, main_builder=main_builder)

    def collect(self, **config):
        log = config.get('log', None)
        for dependency in self.get_dependencies():
            dependency.collect(**config)
        main_builder = config['main_builder']
        current_cache_dir = self.cache_dir_frontend
        if not os.path.exists(current_cache_dir):
            os.mkdir(current_cache_dir)

        if isinstance(self.src, WrappedSource):
            self.src.export(current_cache_dir, log=log)
        else:
            # only collect, if its not a link for development stage
            if not os.path.islink(current_cache_dir):
                for root, dirnames, filenames in os.walk(self.src):
                    relative_path = os.path.relpath(root, self.src)
                    for path in dirnames:
                        if path.startswith('.') or (os.path.sep + '.') in relative_path:
                            continue
                        path = os.path.join(relative_path, path)
                        if not os.path.exists(os.path.join(current_cache_dir, path)):
                            os.mkdir(os.path.join(current_cache_dir, path))

                    for path in filenames:
                        if path.startswith('.') or (os.path.sep + '.') in relative_path:
                            continue
                        path = os.path.join(relative_path, path)
                        if os.path.exists(os.path.join(current_cache_dir, path)):
                            os.unlink(os.path.join(current_cache_dir, path))
                        os.symlink(os.path.join(self.src, path), current_cache_dir + os.path.sep + path)

    def update_db(self, **config):
        for dependency in self.get_dependencies():
            dependency.update_db(**config)

        if self.skip_db:
            return
        pass

    def load_config(self):
        current_cache_dir = self.cache_dir_frontend
        for dependency in self.get_dependencies():
            self.config = dict_merge(self.config, dependency.load_config())
            #main_builder.set_default_config(self.config)

        # load config file
        if self.type == 'frontend':
            import yaml
            try:
                # loading a simple yaml config file
                with open(os.path.join(current_cache_dir, self.get_frontend_config_path())) as content:
                    self.config = dict_merge(self.config, yaml.load(content.read()) or {})
            except IOError:
                try:
                    # processing config folder
                    with open(os.path.join(current_cache_dir, self.get_frontend_config_path(folder=True))) as content:
                        self.config = dict_merge(self.config, yaml.load(content.read()) or {})
                except IOError:
                    raise

        if self._config:
            self.config = dict_merge(self.config, self._config)

        # set vars for builder from config
        self.current_stage = 'debug'  # TODO: get from config
        self.skip_db = self.config.get('config', {}).get('skipDB', False)

        return self.config

    def build_from_cache(self, **config):
        for dependency in self.get_dependencies():
            dependency.build_from_cache(**config)

        log = config.get('log')
        log = log.with_indent('building ' + self.name)
        current_source_dir = self.cache_dir_frontend
        for root, dirnames, filenames in os.walk(current_source_dir):
            relative_path = os.path.relpath(root, current_source_dir)
            for path in filenames:
                if path.startswith('.') or ((os.path.sep + '.') in relative_path):
                    continue
                path = os.path.join(relative_path, path)
                if log:
                    config['log'] = log.with_indent(path)
                with open(os.path.join(current_source_dir, path), 'r') as content:
                    self.update(path, content.read(), build=True, **config)

    def build_from_db(self, storages, log=None, main_builder=None):
        log = log.with_indent('building')
        pass #TODO

    def update_configuration(self, **config):
        if config['main_builder'] is self:
            # write to storage
            config['path'] = self.get_frontend_config_dest_path()
            config['content'] = json.dumps(self.build_frontend_config())  # maybe just update from updated content in **config
            self.update(**config)

    def build_frontend_config(self, content=None):
        config = {}
        for key in ['start', 'requirejs']:
            config[key] = self.get_config(key) or {}
        for key in ['debug_level']:
            config[key] = self.get_config(key)

        config['start']['apps'] = {}
        host = 'http://localhost:8000/api/'
        
        for app, app_config in self.get_config('apps', default={}).items():
            defaults_namespace = 'fancy-frontend' # TODO from cinfig
            if not isinstance(app_config, dict):
                app_config = {}
            prefix = app_config.get('namespace', '')
            apps = {}
            apps[app] = {
                'namespace': prefix,
                'defaults_namespace': defaults_namespace
            }
            for dependency in self.dependency_map.values():
                apps[dependency.name] = {
                    "namespace": dependency.name,
                    'defaults_namespace': defaults_namespace
                }

            host = app_config.get('base_url', '/api/')
            config['start']['apps'][app] = {
                'init': {
                    'host': host,
                    'content_host': host + 'frontend/content/',
                    'crossDomain': False
                },
                'selector': '[load-' + app+']',
                'cssConfig': {
                    'cssUrl': '',
                    'versions': {},
                    'themes': {},
                },
                'start': {},
                'appName': app,
                'appFile': app_config.get('fileName', app),
                'localesUrl': None,
                'htmlUrl': None,

                "debug_level": 0,
                "defaults_namespace": "fancy_angular",
                "namespace": self.name,
                "prefix": prefix,
                "widgets": {
                    "defaults_namespace": "fancy_angular",
                    "namespace": self.name,
                    "prefix": prefix
                },
                "apps": apps,

                "css": {
                    "namespaces": {
                        "ui": {
                            "prefix": "ui-"
                        }
                    }
                }
            }
        static_host = host + 'frontend/static/'
        config['requirejs']['baseUrl'] = static_host
        return config

    def generate_build_path(self, orig_path):
        built_root = '.'
        collected = False
        ignore = False
        path = orig_path
        unversioned = None

        if self.filter and not re.compile(self.filter).match(path):
            ignore = True

        if self.get_config('staging', 'filtered_files') and self.get_config('staging', 'configurations') and any(
            path.replace('.' + e, '.{stage}') in self.get_config('staging', 'filtered_files')
            for e in self.get_config('staging', 'configurations').keys()
        ):
            paths = path.split(os.path.sep)
            file_parts = paths[-1].split('.')
            file_name = '.'.join(file_parts[:-1])
            if ('.' + self.current_stage) in path:
                path = path.replace(file_name, file_name.replace('.' + self.current_stage, ''))
            else:
                ignore = True

        if path == self.get_frontend_config_dest_path():
            unversioned = True

        if self.get_config('staging', 'configurations'):
            for configuration, config in self.get_config('staging', 'configurations').items():
                if configuration != self.current_stage:
                    for filter in config['exclusive_files']:
                        if filter in path:
                            ignore = True

        # collect files in new directory hierarchy
        apps_path = 'js'+os.path.sep
        libs_path = 'js'+os.path.sep+'libs'+os.path.sep
        if self.get_config('collect'):
            for search_expr in self.get_config('collect').keys():
                if search_expr in path:
                    collected = True
                    # TODO: implement dynamic method
                    built_root = self.get_config('collect')[search_expr].replace('lib:', libs_path).replace('app:', apps_path)
                    if path.startswith('libs'+os.path.sep):
                        path = path[5:]
                    elif (os.path.sep+'libs'+os.path.sep) in path:
                        path = path.replace(os.path.sep+'libs'+os.path.sep, os.path.sep)
                    # clean collected dir
                    if search_expr.startswith(os.path.sep) and search_expr.endswith(os.path.sep):
                        path = path.replace(search_expr, os.path.sep)
                    break

        if collected is False and self.type == 'lib':
            collected = True
            built_root = libs_path

        # matches by folder name are of higher priority
        if collected is False and (os.path.sep + 'locales' + os.path.sep) in path:
            built_root = 'locales/'
            collected = True

        # collect by file type
        if not collected:
            paths = path.split(os.path.sep)
            file_parts = paths[-1].split('.')
            type = file_parts[-1].lower()
            if type in ['js', 'json']:
                # setting the root location
                built_root = 'js/'
                collected = True
            elif type in ['css', 'scss', 'sass']:
                built_root = 'css/'
                collected = True
            elif type in ['html', 'partial']:
                built_root = 'partials/'
                collected = True
            elif type in ['svg', 'ico', 'png', 'jpeg', 'jpg', 'gif']:
                if 'css' in path:
                    built_root = 'css/'
                else:
                    built_root = 'img/'
                collected = True

        if collected:
            # "clean" the new_path. removing /html/ if inside and saved under ./html/, a.s.o.
            for directory_name in ['js', 'partials', 'css', 'locales']:  #built_root.split(os.path.sep):
                if directory_name:
                    path = path.replace(os.path.sep + directory_name + os.path.sep, os.path.sep)
            # if you register a something for a lib from within an app, this results in lib/../apps/app_name
            for directory_name in ['apps']:  # TODO: this should be in just one loop
                if directory_name:
                    path = path.replace(os.path.sep + directory_name + os.path.sep, os.path.sep)

            if unversioned is None:
                if self.get_config('unversioned'):
                    for pattern in self.get_config('unversioned'):
                        if pattern in path:  # TODO: regex?
                            unversioned = True

            if not unversioned and (self.get_config('unversioned', None) is None or path not in self.get_config('unversioned')):
                paths = path.split(os.path.sep)
                file_parts = paths[-1].split('.')
                if file_parts[-1] == 'js':
                    file_name = '.'.join(file_parts[:-1])
                else:
                    file_name = '.'.join(file_parts)
                path = os.path.sep.join((
                    os.path.sep.join(paths[:-1]),
                    file_name+os.path.sep+'{version}',
                    paths[-1]
                ))
            else:
                path = path

        if ignore or not collected:
            return None
        else:
            path = path.replace(self.src_name, self.name)
            path = os.path.join(built_root, path)
            return path

    def get_build_path(self, path):
        """
        build the whole frontend
        """
        if not path in self.source_map:
            self.source_map[path] = self.generate_build_path(path)

        return self.source_map[path]

    def update(self, path, content, **config):
        """
        updates changed sources

        returns a map of updated paths and their current version
        """
        config['path'] = path
        config['content'] = content
        config['new_path'] = self.get_build_path(path)
        new_path = config['new_path']

        compile_as = None
        if path == self.get_frontend_config_path():
            compile_as = 'js-config'
            config['new_path'] = 'config.json'  # todo self.js_config_dest
            config['rel_path'] = None
        elif (path.startswith('./' + self.name + '/css/') or path.startswith(self.name + '/css/')) and path.split('.')[-1] in ['scss', 'sass', 'css'] and not path.endswith(os.path.sep + 'core.scss'):
            compile_as = 'css-config'
            config['rel_path'] = config['path'].replace(self.name + '/css/', self.name + '/')
            config['new_path'] = 'core.css'
        elif path.endswith('.sass') or path.endswith('.scss'):
            compile_as = 'scss'
            config['new_path'] = new_path.replace('.scss', '.css').replace('.sass', '.css')
            config['rel_path'] = config['path'].replace(self.name + '/widgets/', self.name + '/').replace('/css/', '/')

        if compile_as is not None:
            return self.compile_src(compile_as=compile_as, **config)
        else:
            return self.copy_src(**config)

    def add_css_folder(self, path):
        self.css_sources[path] = None

    def compile_src(self, compile_as, build=False, **config):
        log = config['log']
        log.write('will be compiled as:', compile_as, '(', config['new_path'] if config['new_path'] else 'Nothing', ')')
        # add to compiler queue
        main_builder = config.get('main_builder')
        if not config['new_path'] in main_builder.compiler_queues[compile_as]:
            main_builder.compiler_queues[compile_as][config['new_path']] = SortedDict()
        main_builder.compiler_queues[compile_as][config['new_path']][config['path']] = config

        # pre-compile
        if config['path'].split('.')[-1] in ['scss', 'sass', 'css']:
            if config['path'].endswith('.sass'):
                config['content'] = self.precompile_as('sass', config['content'])
                config['path'].replace('.sass', '.scss')

            compile_path = os.path.join(self.compile_dir, 'css', config['rel_path'])
            compile_dir = os.path.sep.join(compile_path.split(os.path.sep)[:-1])
            main_builder.add_css_folder(os.path.realpath(os.path.join(self.compile_dir, 'css')))
            if not os.path.exists(compile_dir):
                os.makedirs(compile_dir)
            with open(compile_path, 'w+') as file:
                file.write(config['content'])

        # compile
        if not build:
            try:
                main_builder.compile(**config)
            except Exception, e:
                import traceback
                config['log'].error(e.__class__, e, traceback.format_exc())

    def copy_src(self, path, content, new_path, storages=None, log=None, **config):
        if new_path is not None:
            if content is None:
                log = log.with_indent('removing ' + new_path)
            else:
                log = log.with_indent('copying ' + new_path)

            for storage in storages:
                if content is None:
                    return storage.remove(new_path, log=log.with_indent(new_path))
                else:
                    return storage.update(new_path, content, log=log.with_indent(new_path))
        else:
            log.write('ignored')

    def precompile_as(self, compile_as, content=None, **config):
        if compile_as == 'sass':
            import isass
            return isass.get_scss(content) if content else content
        return False

    def compile_as(self, compile_as, content=None, content_list=None, **config):
        if compile_as == 'js-config':
            self.update_configuration(content=content, **config)
            return False
        elif compile_as == 'css-config':
            import scss
            scss.config.PROJECT_ROOT = self.cache_dir_frontend
            scss.config.DEBUG = self.debug
            _scss_opts = {
                'compress': False,
                'debug_info': self.debug,
            }

            config['log'].write('compiling', str(len(content_list)), ' with:', str(len(self.css_vars.keys())), 'vars and', str(len(self.css_sources)), 'locations and ', str(len(self.css_config)), 'files')
            #if content is False or len(self.css_config):
            #    for path, content in self.css_config.items()[::-1]:
            #        content_list.insert(0, path, content)

            _scss = scss.Scss(
                scss_opts=_scss_opts,
                scss_vars=self.css_vars,
                search_paths=self.css_sources,
                scss_files=self.css_config
            )

            config_files = dict(content_list)  # config files are compiled in alphabetical order
            if content is False:
                _scss._scss_files = config_files
                content = _scss.compile()
            else:
                content = _scss.compile(content)

            self.css_vars = _scss.get_scss_vars()
            prefix = self.name

            self.css_vars['$frontend-prefix'] = scss.types.String.unquoted((prefix + '-') if prefix else '')
            self.css_vars['$image-root'] = scss.types.String.unquoted('http://localhost:8001/api/frontend/static/img/')

            for content_path in content_list:
                if not content_path.endswith('consts.scss'):
                    self.css_config[content_path.split('/')[-1]] = content_list[content_path]

                parts = content_path.split(os.path.sep)
                if not parts[1].startswith('consts'):  # and parts[0] == self.name:
                    with open(os.path.join(self.compile_dir, 'css', parts[1]), 'w+') as file:
                        file.write(content_list[content_path])

            config['log'].write('loaded', str(len(self.css_vars.keys())), 'vars from', str(len(content_list)), 'files')
            return False  # content
        elif compile_as == 'scss':
            import scss
            scss.config.PROJECT_ROOT = self.cache_dir_frontend
            scss.config.DEBUG = self.debug
            _scss_vars = self.css_vars
            _scss_opts = {
                'compress': False,
                'debug_info': self.debug,
            }

            _scss = scss.Scss(
                scss_vars=_scss_vars,
                scss_opts=_scss_opts,
                scss_files=self.css_config,
                search_paths=self.css_sources,
            )

            config['log'].write(self.css_config.keys())
            config['log'].write('compiling', str(len(content_list)), 'with:', str(len(_scss_vars.keys())), 'vars and', str(len(self.css_config)), 'files')
            if content is False:# or len(self.css_config):
                #for path, content in self.css_config.items()[::-1]:
                #    content_list.insert(0, path, content)
                _scss._scss_files = content_list
                content = _scss.compile()
            else:
                content = _scss.compile(content)
            #self.css_config[config.get('path')] = content_list
            for content_path in content_list:
                self.css_config[content_path] = content_list[content_path]

            return content
        elif compile_as == 'css':
            pass

        return False

    def compile(self, **config):
        log = config['log']
        #self.update_configuration(**config)
        config.pop('content', None)
        config.pop('path', None)
        config.pop('rel_path', None)
        config.pop('new_path', None)

        for compile_as, queue in self.compiler_queues.items():
            current_log = log.with_indent(compile_as)
            last_app = None
            apps_content = SortedDict()
            for new_path, contents in queue.items():
                cur_log = current_log.with_indent(str(new_path))
                content = -1
                content_list = SortedDict()
                for path, path_config in contents.items():
                    if content == -1:
                        content = path_config['content']
                    else:
                        content = False
                    content_list[path_config['rel_path']] = path_config['content']

                    current_app = (path_config['rel_path'].split(os.path.sep)[0] if len(path_config['rel_path'].split(os.path.sep)) > 1 else None) if path_config['rel_path'] else None
                    if current_app is not None:
                        apps_content[path_config['rel_path']] = path_config['content']

                if content == -1:
                    #raise Exception(str((compile_as, new_path, contents)))
                    cur_log.write('no content')
                    continue
                
                config['log'] = cur_log
                compile_config = dict(content=content, content_list=content_list, path=path_config['rel_path'], new_path=new_path, **config)
                content = self.compile_as(compile_as, **compile_config)
                if content is not False:  # and self.debug # at least when using css
                    compile_config['content'] = content
                    self.copy_src(**compile_config)

                if current_app is not None and last_app != current_app:
                    if last_app is not None:
                        if compile_as == 'scss':  # TODO: genrating a core.css for each frontend. now it lecks new_path for core.css
                            new_path = self.generate_build_path('./css' + os.path.sep + last_app + os.path.sep + 'core.css')

                            compile_config = dict(content=False, content_list=apps_content, path=new_path, new_path=new_path, **config)
                            content = self.compile_as(compile_as, **compile_config)
                            if content is not False:
                                compile_config['content'] = content
                                self.copy_src(**compile_config)

                    apps_content = SortedDict()
                if current_app is not None:
                    last_app = current_app

            if compile_as == 'scss':
                if not last_app:
                    last_app = self.name
                #build_path = self.generate_build_path('./css/core.css')
                build_path = self.generate_build_path('./css' + os.path.sep + last_app + os.path.sep + 'core.css')
                compile_config = dict(content=False, content_list=self.css_config, path=build_path, new_path=build_path, **config)
                content = self.compile_as(compile_as, **compile_config)
                if content is not False:
                    compile_config['content'] = content
                    self.copy_src(**compile_config)

            self.compiler_queues[compile_as] = SortedDict()

    def remove(self, **config):  #path, storages, log=None, main_builder=None):
        """
        builds those files again, that are influenced by the removed source

        returns a map of updated paths and their current version
        """
        config['content'] = None
        return self.update(**config)
