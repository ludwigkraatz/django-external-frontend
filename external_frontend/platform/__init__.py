import os
import re
from ..settings import settings as externalFrontendSettings
from django.conf import settings
from introspective_api.reverse import reverse_nested


class Platform(object):
    root_sources = ''
    _index_path = 'index.html'
    _index_html = """
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <script>
                window.frontend_config = {{
                    statics_url: '{FRONTEND_STATICS}',
                    config_url: '{CONFIG_PATH}'
                }};
            </script>
            {BEFORE_MAIN}
            <script data-main="{FRONTEND_STATICS}{MAIN_PATH}" src="{FRONTEND_STATICS}{REQUIRE_PATH}"></script>
        </head>
        <body load-{FRONTEND_NAME}="{WIDGET_NAME}">
        </body>
    </html>
        """

    def is_root_source(self, path):
        ret = bool(path and self.root_sources and re.compile(self.root_sources, flags=re.DOTALL).match(path))
        return ret

    @property
    def index_path(self):
        return self.generate_build_path(self._index_path, self._index_path)

    def __init__(self, **kwargs):
        self.name = kwargs['settings'].NAME

    def generate_build_path(self, path, build_path):
        if build_path is not None and self.is_root_source(path):
            return '.' + os.path.sep + path.split(os.path.sep)[-1]
        return build_path

    def patch_path(self, path, **config):
        if path:  # TODO: and externalFrontendSettings.PATCH_PATH:
            path = os.path.join(self.name, path)
        return path

    def get_static_url(self, **config):
        frontend = config.get('main_builder')
        platform = config.get('platform')
        if externalFrontendSettings.STATICS_OVER_API and not platform.FRONTEND_URL:
            static_root_url = reverse_nested('api:'+externalFrontendSettings.API_FRONTEND_PREFIX+':static-root', current_app=self.name)
        else:
            static_root_url = platform.FRONTEND_URL.format(
                frontend=frontend.name,
                platform=platform.NAME,
                host=''
            )
        return static_root_url

    def get_template_context(self, builder, additional_context=None, **config):
        context = dict(
            MAIN_PATH = 'forever/js/main/0/main.js',  # TODO: get path from builder
            REQUIRE_PATH = 'js/require.js',
            CONFIG_PATH = 'forever/js/config.json/0/config.json',  # TODO: get path from builder
            FRONTEND_STATICS = self.get_static_url(**config),
            FRONTEND_NAME = builder.name,
            WIDGET_NAME = builder.name,
            FRONTEND_VERION = '0.0.1',
            FRONTEND_DESCRIPTION = 'fsdf',
            AUTHOR_MAIL = 'dfsadf',
            AUTHOR_URL = 'dfsadaaa',
            AUTHOR_TEXT = 'dfsafsdfedf',
        )
        if additional_context:
            context.update(additional_context)
        context['BEFORE_MAIN'] = getattr(self, '_index_html_pre_header', '').format(**context)
        context['AFTER_MAIN'] = getattr(self, '_index_html_post_header', '').format(**context)
        return context

    def compile(self, builder, queue, **compile_config):
        content = self.generate_index(builder, **compile_config)
        if content is not False:
            compile_config['content'] = content
            compile_config['path'] = None
            compile_config['new_path'] = self.index_path
            builder.copy_src(**compile_config)

    def generate_index(self, builder, **compile_config):
        return self._index_html.format(**self.get_template_context(builder, **compile_config))
