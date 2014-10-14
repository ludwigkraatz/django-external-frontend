#from ..settings import widget_settings
#from django.utils.builder import
import os
import shutil
from ..settings import settings as externalFrontendSettings


class Storage(object):
    """
    the Storage is the linker between the View and the actual sources.
    """

    def __init__(self, settings):
        self.clean_build = settings.CLEAN_BUILD

    class PathNotFound(Exception):
        pass

    def pre_build(self, log=None):
        if self.clean_build:
            self.clean(log=log)

    def build(self, frontend, **config):
        pass

    def clean(self, log=None):
        raise NotImplemented('subclass needs to specify behaviour')

    def remove(self, path):
        raise NotImplemented('subclass needs to specify behaviour')

    def update(self, path):
        raise NotImplemented('subclass needs to specify behaviour')

    def get(self, path):
        raise NotImplemented('subclass needs to specify behaviour')

    def get_current_verion(self, path_template):
        pass

    def solve_path(self, path_template, content):
        current_version = 1
        if True:  # TODO: implement / settings.DEBUG:
            return path_template.format(version=current_version)

        path = os.path.join(self.root, path_template)

        # TODO: hash content and compare
        with open(path, 'r') as current_content:
            if content == current_content.read():
                return path_template.format(version=version)

        return path_template.format(version=version)


class FileStorage(Storage):
    root = None

    def __init__(self, settings=None, **kwargs):
        super(FileStorage, self).__init__(settings, **kwargs)
        self.root = settings.ROOT

        if not os.path.exists(self.root):
            if os.path.exists(os.path.sep.join(self.root.split(os.path.sep)[:-1])):
                os.mkdir(self.root)
            else:
                raise Exception('FileStorage view need to be initialized with existing root directory. \
                                "%s" does not exist' % self.root)

    def exists(self):
        return os.path.exists(self.root)

    def clean(self, log=None):
        if self.exists():
            shutil.rmtree(self.root)

    def update(self, path, content, log=None):
        path = os.path.join(self.root, self.solve_path(path, content))
        #log.write('absolute path:' + path)

        dirs = os.path.sep.join(path.split(os.path.sep)[:-1])
        if not os.path.exists(dirs):
            os.makedirs(dirs)
            log.write('dirs created')

        with open(path, 'w') as new_file:
            new_file.write(content)
            log.write('content written')

    def remove(self, path, log=None):
        # versioned Storage does not delete
        log.write('no action.')
        return
        #path = os.path.join(self.root, self.solve_path(path, content))

        #if os.path.exists(os.path.join(self.root, path)):
        #    os.remove(os.path.join(self.root, path))
        # TODO: recursively remove directories if empty

    def get(self, path, requirejsFallback=None):
        if requirejsFallback:
            if os.path.exists(os.path.join(self.root, requirejsFallback)):
                path = requirejsFallback
        try:
            with open(os.path.join(self.root, path), 'r') as content:
                return content.read()
        except IOError, OSError:
            raise self.PathNotFound()


class StaticsStorage(FileStorage):
    def get(self, path, requirejsFallback=None):
        class request(object):  # mockup
            META = {'HTTP_IF_MODIFIED_SINCE': None}

        try:
            return super(StaticsStorage, self).get(path, requirejsFallback)
        except self.PathNotFound:
            from django.contrib.staticfiles.views import serve
            from django.utils.six.moves.urllib.request import url2pathname
            from django.http import Http404
            if requirejsFallback:
                if os.path.exists(os.path.join(self.root, requirejsFallback)):
                    path = requirejsFallback
            try:
                return serve(request, path, insecure=True)
            except Http404:
                pass

            raise self.PathNotFound()


class DevelopmentStorage(StaticsStorage):
    def get_version(self, *args, **kwargs):
        return 1


class VirtualStorage(Storage):
    pass


class DBStorage(VirtualStorage):

    def update(self, path, content):
        """
        writes changed file to DB
        """
        pass
