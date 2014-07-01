import os


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

        if not os.path.exists(self.src):
            raise Exception('FrontendBuilder need to be initialized with existing src directory.\
                            "%s" does not exist' % self.src)

        self.storage = settings._parent.STORAGE

        if not self.storage:
            raise Exception('FrontendBuilder need to be initialized with a storage')

        self.source_map = {}
        #self.load()

    def load_config(self, content):
        import yaml
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

        self.config = yaml.load(content)
        self.current_stage = 'debug'

    def load(self, log=None):
        self.storage.clean()
        try:
            with open(self.src + os.path.sep + '.external_frontend') as content:
                self.load_config(content.read())
                log.write('config loaded')
        except IOError:
            log.write('no config found')
        for root, dirnames, filenames in os.walk(self.src):
            for path in filenames:
                if path.startswith('.'):
                    continue
                path = os.path.join(os.path.relpath(root, self.src), path)
                if log:
                    log.write(path)
                with open(os.path.join(self.src, path), 'r') as content:
                    self.update(path, content.read(), log=log)

    def generate_build_path(self, orig_path):
        built_root = None
        collected = False
        ignore = False
        path = orig_path

        # prepare path before processing
        if not path.startswith('./'):
            path = './' + path

        if any(
            path.replace('.' + e, '.{stage}') in self.config['staging']['filtered_files']
            for e in self.config['staging']['configurations'].keys()
        ):
            paths = path.split(os.path.sep)
            file_parts = paths[-1].split('.')
            file_name = '.'.join(file_parts[:-1])
            if ('.' + self.current_stage) in path:
                path = path.replace(file_name, file_name.replace('.' + self.current_stage, ''))
            else:
                ignore = True

        for configuration, config in self.config['staging']['configurations'].items():
            if configuration != self.current_stage:
                for filter in config['exclusive_files']:
                    if filter in path:
                        ignore = True

        # collect files in new directory hirachy

        for search_expr in self.config['collect'].keys():
            if search_expr in path:
                collected = True
                # TODO: implement dynamic method
                built_root = self.config['collect'][search_expr].replace('lib!', 'js'+os.path.sep+'libs'+os.path.sep)
                # clean collected dir
                if search_expr.startswith(os.path.sep) and search_expr.endswith(os.path.sep):
                    path = path.replace(search_expr, os.path.sep)

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

            unversioned = False
            for pattern in self.config['unversioned']:
                if pattern in path:  # TODO: regex?
                    unversioned = True
            if not unversioned and path not in self.config['unversioned']:
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
            return built_root + path

    def get_build_path(self, path):
        """
        build the whole frontend
        """
        if not path in self.source_map:
            self.source_map[path] = self.generate_build_path(path)

        return self.source_map[path]

    def update(self, path, content, log=None):
        """
        updates changed sources

        returns a map of updated paths and their current version
        """
        compile_as = None
        if path.endswith('.sass'):
            compile_as = 'scss'
            path = path.replace('.sass', '.css')
        new_path = self.get_build_path(path)
        if new_path is not None:
            log.write('new path = ' + new_path)
            if compile_as:
                content = self.compile(compile_as, content)
            self.storage.update(new_path, content, log=log)
        else:
            log.write('ignored')

    def compile(self, type, content):
        if type == 'scss':
            import scss
            return scss.Scss(scss_opts={
                'compress': False,
                'debug_info': True,#settings.DEBUG,
            }).compile(content)

    def remove(self, path, log=None):
        """
        builds those files again, that are influenced by the removed source

        returns a map of updated paths and their current version
        """
        new_path = self.get_build_path(path)
        if new_path is not None:
            log.write('old path = ' + new_path)
            self.storage.remove(new_path, log=log)
        else:
            log.write('ignored')

    def get_version(self, path_template, content):
        """
        when building the frontend with versioning turned on, the builder stores
        files in a different version subfolder, when the contend of similar paths
        differs.

        @param newFile: handle of the new file
        @param destinationPathTemplate: a python formatting string with a {version} var,
                                        specifying the destination in the build frontend
        @param oldFileVersion: the version of the actual file on this path; default = 1
        """
        # TODO: self.storage.get_version()
        pass
