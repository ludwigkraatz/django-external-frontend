import os
import time
import sys
import json
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from ..utils.dict import dict_merge


def launch_observer(storages, builder, src, log):

    class Handler(FileSystemEventHandler):
        def prepare_path(self, path):
            path = os.path.relpath(path, src)
            prefix = '.' + os.path.sep
            if not path.startswith(prefix):
                path = prefix + path
            return path

        def on_created(self, event):
            if not event.is_directory:
                with open(event.src_path, 'r') as content:
                    path = self.prepare_path(event.src_path)
                    log.write("Created: " + path)
                    builder.update(path, content.read(), storages=storages, log=log.with_indent())

        def on_deleted(self, event):
            if not event.is_directory:
                path = self.prepare_path(event.src_path)
                log.write("Removed: " + path)
                builder.remove(path, storages=storages, log=log.with_indent())

        def on_moved(self, event):
            if not event.is_directory:
                with open(event.dest_path, 'r') as content:
                    path = self.prepare_path(event.src_path)
                    dest_path = self.prepare_path(event.dest_path)
                    log.write("Moved: " + path + ' to ' + dest_path)
                    builder.remove(path, storages=storages, log=log.with_indent())
                    builder.update(dest_path, content.read(), storages=storages, log=log.with_indent())

        def on_modified(self, event):
            if not event.is_directory:
                with open(event.src_path, 'r') as content:
                    path = self.prepare_path(event.src_path)
                    log.write("Modified: " + path)
                    builder.update(path, content.read(), storages=storages, log=log.with_indent())

    event_handler = Handler()
    observer = Observer()
    observer.schedule(event_handler, src, recursive=True)
    observer.start()
    return observer


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

        self.src = settings.SRC
        self.observers = []

        def get_dependencies():
            #raise Exception(str(settings.__dict__['_dict']))
            #raise Exception(str([setting.NAME for setting in settings.DEPENDS_ON]))
            #raise Exception([str(setting) for setting in settings.DEPENDS_ON])
            return settings.DEPENDS_ON
        self.get_dependencies = get_dependencies

        if not os.path.exists(self.src):
            raise Exception('FrontendBuilder need to be initialized with existing src directory.\
                            "%s" does not exist' % self.src)

        self.source_map = {}
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

    def run_dependencies(self, storages, log=None, main_builder=None):
        main_builder = main_builder or self
        config = {}
        for dependency in self.get_dependencies():
            dependency_log = log.with_indent('loading dependency "%s"' % dependency)
            if dependency.run(storages=storages, log=dependency_log, main_builder=main_builder):
                self.set_default_config(dependency.config)
                # TODO: update config with parent config as default?
            else:
                log.write('couldn\'t load dependency "%s"' % dependency)
        return config

    def register_observers(self, observer):
        if isinstance(observer, list):
            self.observers += observer
        else:
            self.observers.append(observer)

    def run(self, storages, log, main_builder=None):
        self.load_config(log=log)
        if main_builder is None:
            self.clean(storages=storages, log=log.with_indent())

        # first run_dependencies - the default config is set there
        self.run_dependencies(storages=storages, log=log, main_builder=main_builder)
        self.load(storages=storages, log=log, main_builder=main_builder)

        self.register_observers(launch_observer(storages, self, self.src, log=log))

        if main_builder is not None:
            main_builder.register_observers(self.observers)
            return True
        else:
            observer_log = log.with_indent("%s observer started" % len(self.observers))
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                for dependency_observer in self.observers:
                    dependency_observer.stop()
            for dependency_observer in self.observers:
                dependency_observer.join()

    def load_config(self, log=None):
        import yaml
        try:
            with open(os.path.join(self.src, self.get_frontend_config_path())) as content:
                log.write('config loaded')
                self.config = yaml.load(content.read()) or {}
        except IOError:
            log.write('no config found')
        self.current_stage = 'debug'

    def get_config(self, *args, **kwargs):
        config = self.config
        default = kwargs.get('default', None)

        for arg in args:
            if arg in config:
                config = config.get(arg)
            else:
                return default
        return config

    def set_default_config(self, config):
        self.config = dict_merge(config, self.config)

    def clean(self, storages, log=None):
        for storage in storages:
            if log:
                log.write('cleaning "%s"' % storage)
            storage.clean()

    def load(self, storages, log=None, main_builder=None):
        log = log.with_indent('loading files')
        for root, dirnames, filenames in os.walk(self.src):
            for path in filenames:
                if path.startswith('.'):
                    continue
                path = os.path.join(os.path.relpath(root, self.src), path)
                if log:
                    log.write(path)
                with open(os.path.join(self.src, path), 'r') as content:
                    self.update(path, content.read(), storages=storages, log=log)

        self.update_configuration(storages, log=log, main_builder=main_builder)

    def update_configuration(self, storages, log=None, main_builder=None):
        if main_builder is None:
            # TODO: updated self.config and all merge config of all dependencies
            # build configuration file
            self.update(self.get_frontend_config_dest_path(), json.dumps(self.build_frontend_config()), storages, log=log)
        else:
            # todo: main_builder.update_configuration(storages, log=log)
            pass

    def get_frontend_config_path(self):
        return '.' + os.path.sep + 'external_frontend.yml'

    def get_frontend_config_dest_path(self):
        return self.get_config('configuration_file') or ('.' + os.path.sep + 'config.json')

    def build_frontend_config(self, content=None):
        config = {}
        for key in ['start', 'requirejs']:
            config[key] = self.get_config(key) or {}
        for key in ['debug_level']:
            config[key] = self.get_config(key)

        config['start']['apps'] = {}
        host = 'http://localhost:8000/api/'
        for app, app_config in self.get_config('apps', default={}).items():
            if not isinstance(app_config, dict):
                app_config = {}

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
                'htmlUrl': None
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

        if self.get_config('collect'):
            for search_expr in self.get_config('collect').keys():
                if search_expr in path:
                    collected = True
                    # TODO: implement dynamic method
                    built_root = self.get_config('collect')[search_expr].replace('lib!', 'js'+os.path.sep+'libs'+os.path.sep)
                    if path.startswith('libs'+os.path.sep):
                        path = path[5:]
                    elif (os.path.sep+'libs'+os.path.sep) in path:
                        path = path.replace(os.path.sep+'libs'+os.path.sep, os.path.sep)
                    # clean collected dir
                    if search_expr.startswith(os.path.sep) and search_expr.endswith(os.path.sep):
                        path = path.replace(search_expr, os.path.sep)
                    break

        # matches by folder name are of higher priority
        if (os.path.sep + 'locales' + os.path.sep) in path:
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
            for directory_name in built_root.split(os.path.sep):
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

            if not unversioned and path not in self.get_config('unversioned'):
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
            path = os.path.join(built_root, path)
            return path

    def get_build_path(self, path):
        """
        build the whole frontend
        """
        if not path in self.source_map:
            self.source_map[path] = self.generate_build_path(path)

        return self.source_map[path]

    def update(self, path, content, storages, log=None, main_builder=None):
        """
        updates changed sources

        returns a map of updated paths and their current version
        """
        if path == self.get_frontend_config_path():
            return self.update_configuration(storages, log=log, main_builder=main_builder)

        compile_as = None
        if path.endswith('.sass'):
            compile_as = 'sass'
            path = path.replace('.sass', '.css')
        elif path.endswith('.scss'):
            compile_as = 'scss'
            path = path.replace('.scss', '.css')
        new_path = self.get_build_path(path)
        if new_path is not None:

            log.write('new path = ' + new_path)
            if compile_as:
                content = self.compile(compile_as, content)
            for storage in storages:
                storage.update(new_path, content, log=log.with_indent(new_path))
        else:
            log.write('ignored')

    def compile(self, type, content):
        if type == 'sass':
            import isass
            return self.compile('scss', isass.get_scss(content))
        if type == 'scss':
            import scss
            return scss.Scss(scss_opts={
                'compress': False,
                'debug_info': True,#settings.DEBUG,
            }).compile(content)

    def remove(self, path, storages, log=None, main_builder=None):
        """
        builds those files again, that are influenced by the removed source

        returns a map of updated paths and their current version
        """
        new_path = self.get_build_path(path)
        if new_path is not None:
            log.write('old path = ' + new_path)
            for storage in storages:
                storage.remove(new_path, log=log.with_indent(new_path))
        else:
            log.write('ignored')
