import os


wrappedGitMethodMap = {
    'export': lambda repo, destination: repo.index.checkout(
        force=True,
        prefix=os.path.realpath(destination) + os.path.sep
    )
}


class WrappedSource(str):
    def __new__(self, *args, **kwargs):
        return super(WrappedSource, self).__new__(self, args[0])

    def __init__(self, cache, source, method_map=None):
        super(WrappedSource, self).__init__(source)
        self.source = source
        self.cache = cache
        self.handler = None
        self.method_map = method_map or self.determine_method_map(source)

    def determine_method_map(self, source):
        if '.git' in source:
            return wrappedGitMethodMap
        return None

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

    def export(self, destination, log=None):
        if self.handler is None:
            self.handler = self.initHandler(self.source, self.cache, log=log)
        return self.method_map['export'](self.handler, destination)

    def initHandler(self, source, cache, log=None):
        # TODO: move this somehow to method_map
        if log:
            log = log.with_indent('init wrappedSource:' + str(source))
        from git import *

        commit = None
        if '@' in source.split(':')[-1]:
            parts = source.split('@')
            source = '@'.join(parts[0:-1])
            commit = parts[-1]

        if not os.path.exists(cache + os.path.sep + '.git'):
            repo = Repo.clone_from(source, cache)
            if log:
                log.write('cloning from', source)
        else:
            if log:
                log.write('updating from', source)
            repo = Repo(cache)
            repo.git.execute(['git', 'fetch'])
            if commit:
                branches = repo.git.execute(['git', 'branch', '--contains', commit])
                branch = branches.split('\n')[-1].strip()
                branch = branches.split(' ')[-1] if ' ' in branch else branch
                if branch == 'branch)':
                    branch = None
            else:
                branch = None

            if branch:
                repo.git.checkout(branch)  # TODO: is this the right/best way?
                repo.remotes.origin.pull(branch)

        if commit:  # TODO: this is not always working? maybe always checkout branch first?
            if log:
                log.write('using commit', commit)
            repo.git.checkout(commit)

        return repo
