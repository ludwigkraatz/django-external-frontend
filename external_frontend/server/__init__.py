from introspective_api.generics import RetrieveAPIView
from ..api import renderers
from ..settings import settings

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
        import os
        super(StaticsServer, self).__init__(*args, **kwargs)
        try:
            self.storage = self.get_config()['storage']
        except KeyError:
            raise Exception('StaticsServer view needs to be initialized with "storage" defined in view_config\
                            or as EXTERNAL_FRONTEND.FRONTEND.STORAGE setting')

    def get_format_suffix(self, **kwargs):
        if len(kwargs.get('file').split('.')) > 2 and kwargs.get('file').split('.')[-1] == 'js' and kwargs.get('file').split('.')[-2] in ['json', 'html']:
            return '.'.join(kwargs.get('file').split('.')[-2:])
        return kwargs.get('file').split('.')[-1]

    def get(self, request, *args, **kwargs):
        import os

        requested_file = kwargs.get('file')
        # TODO: is this right? istn't response created on the fly?
        from introspective_api.response import ApiResponse
        requirejsFallback = self.get_format_suffix(**kwargs).split('.') > 2
        try:
            return ApiResponse(self.storage.get(requested_file, requirejsFallback=requirejsFallback))
        except self.storage.PathNotFound:
            file_path = ''
            file_name = ''
            root = self.storage.root

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

            debug_info = {
                'requested': requested_file,
                'requirejsFallback': requirejsFallback,
                'root': root,
                'file_name': file_name,
                'found_path': file_path,
                'dir': os.listdir(os.path.join(root, file_path))
            }
            return ApiResponse(debug_info, 404)
