from introspective_api.generics import RetrieveAPIView
from ..api import renderers
from ..settings import settings
import os
from introspective_api.response import ApiResponse

# TODO: watch srces, when static server is active?


class StaticsServer(RetrieveAPIView):
    renderer_classes = [  # it is important, that FallbackRenderers are listed first
        renderers.requirejsFallbackRenderer,
        renderers.requirejsFallbackHTMLRenderer,
        renderers.PngRenderer,
        renderers.GifRenderer,
        renderers.SvgRenderer,
        renderers.JSRenderer,
        renderers.CSSRenderer,
        renderers.HTMLRenderer,
        renderers.JSONRenderer,
        renderers.ApiRenderer
    ]

    def __init__(self, *args, **kwargs):
        super(StaticsServer, self).__init__(*args, **kwargs)
        try:
            self.frontend = self.get_config()['frontend']
            self.platform = self.get_config().get('platform', None)
        except KeyError:
            raise
            raise Exception('StaticsServer view needs to be initialized with "frontend" defined in view_config\
                            or with EXTERNAL_FRONTEND.FRONTEND.BUILDER.STORAGE setting')

        self.storages = [self.frontend.API_SERVED_STORAGE]

    def get_format_suffix(self, **kwargs):
        if len(kwargs.get('file').split('.')) > 2 and kwargs.get('file').split('.')[-1] == 'js' and kwargs.get('file').split('.')[-2] in ['json', 'html']:
            return '.'.join(kwargs.get('file').split('.')[-2:])
        return kwargs.get('file').split('.')[-1]

    def get(self, request, *args, **kwargs):

        requested_file = kwargs.get('file')
        if not requested_file:
            return ApiResponse({}, 404).finalize_for(request)
        requirejsFallback = ''
        if self.get_format_suffix(**kwargs).split('.') > 2:
            requirejsFallback = '.'.join(requested_file.split('.')[0:-1])

        checked_dirs = []
        debug_info = []
        for storage in self.storages:
            try:
                return ApiResponse(
                    storage.get(
                        requested_file,
                        requirejsFallback=requirejsFallback,
                        frontend=self.frontend,
                        platform=self.platform,
                        http=True
                    )
                ).finalize_for(request)
            except storage.PathNotFound, e:
                checked_dirs.append(storage.root)
                debug_info.append(e.debug_info)

        file_path = ''
        file_name = ''
        for root in checked_dirs:
            for folder in requested_file.split('/'):
                if os.path.exists(os.path.join(root, file_path, folder + os.path.sep)):
                    file_path += folder + os.path.sep
                elif requirejsFallback and os.path.exists(os.path.join(root, file_path, '.'.join(folder.split('.')[0:-1]))):
                    file_name = '.'.join(folder.split('.')[0:-1])
                    break
                elif os.path.exists(os.path.join(root, file_path, folder)):
                    file_name = folder
                    break
                else:
                    break

        return ApiResponse(debug_info, 404).finalize_for(request)
