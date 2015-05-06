import os
import shutil
import re


class NotExecuted(object):
    pass


class NotExecutedError(NotImplementedError):
    pass


def export_folder(self, handler, cache_dir, filter):
    current_source = handler
    current_cache_dir = cache_dir
    for current_root, dirnames, filenames in os.walk(current_source):
        relative_path = os.path.relpath(current_root, current_source)

        for path in filenames:
            if path.startswith('.') or ('.' + os.path.sep) in relative_path or (os.path.sep + '.') in relative_path:
                continue
            path = os.path.join(relative_path, path)
            if filter and not re.compile(filter).match(path):
                continue
            dir_path = os.path.dirname(path)
            if not os.path.exists(os.path.join(current_cache_dir, dir_path)):
                os.makedirs(os.path.join(current_cache_dir, dir_path))
            if os.path.exists(os.path.join(current_cache_dir, path)):
                os.unlink(os.path.join(current_cache_dir, path))
            os.symlink(os.path.join(current_source, path), current_cache_dir + os.path.sep + path)

def unpack_git_source(self, source):
    commit = None
    if '@' in source.split(':')[-1]:
        parts = source.split('@')
        source = '@'.join(parts[0:-1])
        commit = parts[-1]
    source_identifier = source.split('://')[-1].replace(os.path.sep, '>')
    return source, source_identifier, commit

def init_git_handler(self, source, version_cache, log):
    from git import *
    if log:
        log = log.with_indent('init wrappedSource:' + str(source))

    source, source_identifier, commit = self.unpack_source(source)

    cache = os.path.join(version_cache, source_identifier)
    try_init = True
    update_from_origin = False  # TODO: config that gives more control

    while try_init:
        if not os.path.exists(cache + os.path.sep + '.git'):
            repo = Repo.clone_from(source, cache)
            if log:
                log.write('cloning from', source)
        else:
            repo = Repo(cache)
            if update_from_origin:
                if log:
                    log.write('updating from', source)
                repo.git.execute(['git', 'fetch'])

        if commit:
            branches = repo.git.execute(['git', 'branch', '--contains', commit])
            branch = branches.split('\n')[-1].strip()
            branch = branches.split(' ')[-1] if ' ' in branch else branch
            if branch == 'branch)':
                branch = None
        else:
            branch = None

        try:
            if branch:
                repo.git.checkout(branch)  # TODO: is this the right/best way?
                if update_from_origin:
                    try:
                        repo.remotes.origin.pull(branch)
                    except AssertionError, e:
                        if '[up to date]' not in str(e):
                            raise

            if commit:  # TODO: this is not always working? maybe always checkout branch first?
                if log:
                    log.write('using commit', commit)
                repo.git.checkout(commit)
        except:
            if update_from_origin:
                raise
            else:
                update_from_origin = True
                continue
        try_init = False

    return repo

wrappedGitMethodMap = {
    'export': lambda self, repo, destination, filter: repo.index.checkout(
        filter.replace('^', '').replace('$', '') if filter else filter,
        force=True,
        prefix=os.path.realpath(destination) + os.path.sep
    ),
    'init': init_git_handler,
    'unpack_source': unpack_git_source,
    'escape_source': lambda self, source: self.unpack_source(source)[1]
}
wrappedFolderMethodMap = {
    'export': export_folder,
    'init': lambda self, source, version_cache: os.path.abspath(source) if not os.path.isabs(source) else source
}


class WrappedSource(str):
    def __new__(self, *args, **kwargs):
        if isinstance(args[0], WrappedSource):
            return args[0]

        # fallback to first arg
        return super(WrappedSource, self).__new__(self, args[0])

    def __init__(self, source, version_cache=None, method_map=None):
        super(WrappedSource, self).__init__()
        self.source = source
        self.version_cache = version_cache
        self.handler = None
        self.source_type = None
        self.method_map = method_map or self.determine_method_map(source)
        self.identifier = self.escape_source(source)

    @property
    def cache(self):
        if self.version_cache:
            return self.version_cache
        else:
            return self.source

    def determine_method_map(self, source):
        if '.git' in source:
            self.source_type = 'git'
            return wrappedGitMethodMap
        self.source_type = 'folder'
        return wrappedFolderMethodMap

    def is_available(self):
        if self.method_map is None:
            return True

    def make_available(self, destination=None, log=None):
        if destination:
            return self.export(destination, log)
        else:
            return self.install(log=log)

    def install(self, log=None):
        return False

    def export(self, destination, log=None, filter=None):
        if self.handler is None:
            self.handler = self.initHandler(self.source, self.cache, log=log)
        return self.execute_method('export', self.handler, destination, filter, log=log)

    def initHandler(self, source, version_cache, log=None):
        if version_cache and not os.path.exists(version_cache):
            os.makedirs(version_cache)
        return self.execute_method('init', source, version_cache, log=log)

    def unpack_source(self, *args, **kwargs):
        return self.execute_method('unpack_source', *args, **kwargs)

    def escape_source(self, source):
        ret = self.execute_method('escape_source', source)
        if isinstance(ret, NotExecuted):
            ret = source.replace(os.path.sep, '>')
        return ret

    def execute_method(self, method, *args, **kwargs):
        log = kwargs.get('log', None)
        if log:
            log.write('executing', method, *args, **kwargs)
        force_execution = kwargs.pop('force_execution', False)
        if method in self.method_map:
            try:
                return self.method_map[method](self, *args, **kwargs)
            except TypeError:
                # kwargs are in a way a weak sort of arg - this gives better lambda support
                return self.method_map[method](self, *args)
        elif force_execution:
            raise NotExecutedError()
        return NotExecuted()
