#from ..settings import widget_settings
#from django.utils.builder import
import os
import shutil
from ..settings import settings as externalFrontendSettings
from ..models import SourceVersion
import inspect
from django.core.files.base import ContentFile

_virtual_storage = {}

class Storage(object):
    """
    the Storage is the linker between the View and the actual sources.
    """

    def __init__(self, settings, force_save=False):
        self.name = settings.NAME
        self.clean_build = settings.CLEAN_BUILD
        self.requires_versioned = settings.REQUIRES_VERSIONED
        self.force_save = force_save

    class PathNotFound(Exception):
        def __init__(self, *args, **kwargs):
            super(Storage.PathNotFound, self).__init__(*args)
            self.debug_info = kwargs
            return
            self.debug_info = {
                'requested': requested_file,
                'requirejsFallback': requirejsFallback,
                'checked_dirs': checked_dirs,
                'file_name': file_name,
                'found_path': file_path,
                'dirs': ';\n'.join(','.join(os.listdir(os.path.join(root, file_path))) for root in checked_dirs)
            }

    def pre_build(self, log=None, *args, **kwargs):
        if self.clean_build:
            self.clean(log=log, pre_build=True)

    def build(self, frontend, **config):
        pass

    def clean(self, log=None, *args, **kwargs):
        raise NotImplemented('subclass needs to specify behaviour')

    def remove(self, path):
        raise NotImplemented('subclass needs to specify behaviour')

    def update(self, path):
        raise NotImplemented('subclass needs to specify behaviour')

    def get(self, path, *args, **kwargs):
        raise NotImplemented('subclass needs to specify behaviour')

    def is_versioned(self, frontend, **kwargs):
        return not (frontend.STAGE == 'development' and not self.requires_versioned)

    def get_version(self, orig_path, content, platform, frontend, **kwargs):
        if not self.is_versioned(frontend=frontend):
            return -1
        if orig_path is None:
            # TODO
            return -1

        identifier = '{frontend}.{platform}.{storage}.{path}'.format(
            frontend=frontend.NAME,
            platform=platform.NAME,
            storage=self.name,
            package='',
            path=orig_path
        )

        source, created = SourceVersion.objects.get_or_create(content=content, identifier=identifier)
        return str(source.version)

    def is_latest(self, orig_path, content, platform, frontend, **kwargs):
        if orig_path is None:
            # TODO
            return False

        identifier = '{frontend}.{platform}.{storage}.{path}'.format(
            frontend=frontend.NAME,
            platform=platform.NAME,
            storage=self.name,
            package='',
            path=orig_path
        )

        source, created = SourceVersion.objects.get_or_create(content=content, identifier=identifier)
        return not created

    def solve_path(self, path_template, content, frontend, platform, frontend_path, orig_path=None, current_builder=None, main_builder=None, patch_platform=True, **kwargs):
        current_version = self.get_version(orig_path=orig_path, content=content, platform=platform, frontend=frontend, **kwargs)
        path_template = main_builder.set_version(frontend_path=frontend_path, path_template=path_template, builder=main_builder, path=orig_path, version=current_version, frontend=frontend, platform=platform)

        if platform and patch_platform:
            path_template = platform.patch_path(path_template, frontend=frontend, platform=platform, **kwargs)

        return path_template.replace(os.path.sep + '.' + os.path.sep, os.path.sep)


class FileStorage(Storage):
    root = None

    def __init__(self, settings=None, **kwargs):
        super(FileStorage, self).__init__(settings, **kwargs)
        self.root = settings.ROOT
        self.file_root = self.root

        if not os.path.exists(self.root):
            if True:  # TODO: some more security?: os.path.exists(os.path.sep.join(self.root.split(os.path.sep)[:-1])):
                os.makedirs(self.root)
            else:
                raise Exception('FileStorage view need to be initialized with existing root directory. \
                                "%s" does not exist' % self.root)

    def exists(self, path=None, **kwargs):
        if not path:
            return os.path.exists(self.root)
        return os.path.exists(path)

    def clean(self, log=None, *args, **kwargs):
        if (kwargs.get('pre_build', False) or kwargs.get('force', False)) and self.exists():
            shutil.rmtree(self.root)

    def update(self, path, content, log=None, orig_path=None, platform=None, source=None, **kwargs):
        is_versioned_path = '{version_root}' in path  # TODO: do somehow main_builder.test()
        path = os.path.join(self.file_root, self.solve_path(path, content, orig_path=orig_path, platform=platform, **kwargs))
        log.write('absolute path:' + path)

        self.save(path, content, log=log, is_versioned_path=is_versioned_path, orig_path=orig_path, platform=platform, **kwargs)

    def save(self, path, content, max_length=None, log=None, is_versioned_path=None, orig_path=None, platform=None, **kwargs):
        dirs = os.path.sep.join(path.split(os.path.sep)[:-1])
        if not os.path.exists(dirs):
            os.makedirs(dirs)
            log.write('dirs created')

        elif is_versioned_path and self.exists(path, platform=platform, **kwargs):
            if self.get_version(orig_path, content, platform=platform, **kwargs) != 0:
                log.write('used existing file')
                return

        with open(path, 'w') as new_file:
            new_file.write(content)
            log.write('content written')

    def remove(self, path, log=None, **kwargs):
        is_versioned_path = '{version_root}' in path  # TODO: do somehow main_builder.test()
        path = os.path.join(self.file_root, self.solve_path(path, content, orig_path=orig_path, platform=platform, **kwargs))
        # versioned Storage does not delete
        if is_versioned_path:
            log.write('no action.')
            return
        else:
            self.delete(path, log=log)
        #path = os.path.join(self.root, self.solve_path(path, content))

        #if os.path.exists(os.path.join(self.root, path)):
        #    os.remove(os.path.join(self.root, path))
        # TODO: recursively remove directories if empty

    def get(self, path, requirejsFallback=None, **kwargs):
        path = kwargs.get('platform').patch_path(path, **kwargs)
        requirejsFallback = kwargs.get('platform').patch_path(requirejsFallback, **kwargs) if requirejsFallback else requirejsFallback
        if requirejsFallback:
            if os.path.exists(os.path.join(self.file_root, requirejsFallback)):
                path = requirejsFallback
        try:
            with open(os.path.join(self.file_root, path), 'r') as content:
                return content.read()
        except IOError, OSError:
            raise self.PathNotFound(path=path, root=self.file_root, storage=self, **kwargs)


class StaticsStorage(FileStorage):
    def get(self, path, requirejsFallback=None, **kwargs):
        class request(object):  # mockup
            META = {'HTTP_IF_MODIFIED_SINCE': None}

        try:
            return super(StaticsStorage, self).get(path, requirejsFallback, **kwargs)
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

            raise self.PathNotFound(path=path, root=self.root, storage=self, **kwargs)


class VirtualStorage(Storage):
    def get_storage(self, frontend, platform='.', *args, **kwargs):
        global _virtual_storage
        frontend = getattr(frontend, 'NAME', frontend)
        platform = getattr(platform, 'NAME', platform)

        if not frontend in _virtual_storage:
            _virtual_storage[frontend] = {}
        if not platform in _virtual_storage[frontend]:
            _virtual_storage[frontend][platform] = {}
        return _virtual_storage[frontend][platform]

    def exists(self, path=None, frontend=None, platform=None, **kwargs):
        if not path:
            return True
        return path in self.get_storage(frontend, platform, log=log)

    def pre_build(self, *args, **kwargs):
        pass

    def clean(self, frontend, platform, log=None):
        storage = self.get_storage(frontend, platform, log=log)
        storage.clear()

    def update(self, path, content, frontend, platform, log=None, orig_path=None, source=None, **kwargs):
        path = self.solve_path(path, content, patch_platform=False, orig_path=orig_path, frontend=frontend, platform=platform, **kwargs)
        storage = self.get_storage(frontend, platform, log=log)
        storage[path] = content
        log.write('content written')

    def remove(self, path, frontend, platform, log=None, **kwargs):
        storage = self.get_storage(log=log, **kwargs)
        path = self.solve_path(path, content, patch_platform=False, orig_path=orig_path, frontend=frontend, platform=platform, **kwargs)
        del storage[path]

    def get(self, path, requirejsFallback=None, **kwargs):
        storage = self.get_storage(**kwargs)
        if requirejsFallback:
            if requirejsFallback in storage:
                path = requirejsFallback
        if path in storage:
            return storage[path]
        else:
            global _virtual_storage
            print path
            print _virtual_storage.keys()
            print _virtual_storage['fancyOS'].keys()
            print _virtual_storage['fancyOS']['web'].keys()
            raise self.PathNotFound(path=path, storage=self, storage_entries=storage.keys())


class GenericStorage(StaticsStorage):
    def __init__(self, settings=None, *args, **kwargs):
        super(GenericStorage, self).__init__(settings, *args, **kwargs)
        self.file_root = ''
        try:
            self.storage = settings.STORAGE_CLASS if not inspect.isclass(settings.STORAGE_CLASS) else settings.STORAGE_CLASS(location=self.root)
            self.storage.file_overwrite = True
        except BaseException, e:
            print e
            raise

    def exists(self, path=None, **kwargs):
        if path:
            return self.storage.exists(path)
        return True

    def pre_build(self, *args, **kwargs):
        pass

    def clean(self, frontend, platform, log=None):
        pass

    def save(self, path, content, log=None, is_versioned_path=None, *args, **kwargs):
        if not self.force_save and (is_versioned_path and self.exists(path, **kwargs)) or (not is_versioned_path and self.is_latest(content=content, **kwargs)):#self.get(path, **kwargs) == content):
            log.write('not changed')
            return

        log.write('save content')
        self.storage.save(path, ContentFile(content))

    def delete(self, path, log=None, **kwargs):
        log.write('delete content')
        self.storage.remove(path)

    def get(self, path, requirejsFallback=None, http=False, **kwargs):
        if not http:
            file = self.storage.open(path)
            content = file.read()
            file.close()
            return content
        return self.storage.url(path)


class DBStorage(VirtualStorage):

    def update(self, path, content, **kwargs):
        """
        writes changed file to DB
        """
        pass
