from ..settings import settings
from ..server.api_endpoint import StaticsServer
from introspective_api.endpoints import api_root, ImproperlyConfigured
from introspective_api.views import EndpointView

default_frontend_endpoint = None
frontends = {}
app_name = settings.API_FRONTEND_PREFIX

def get_default_endpoint(name):
    global default_frontend_endpoint, frontends
    if default_frontend_endpoint is None:
        default_frontend_endpoint = api_root.register_endpoint('frontend', active=True)

    return default_frontend_endpoint.register_endpoint(name, namespace=name, app_name=app_name)

if settings.STATICS_OVER_API:
    for name, frontend in settings.FRONTEND_COLLECTION.items():
        frontend_settings = settings.with_configuration({
            'FRONTEND': frontend
        })

        # TODO
        frontend_endpoint = frontend_settings.FRONTEND.ENDPOINT or get_default_endpoint(name)
        frontends[name] = frontend_endpoint
        static = frontend_endpoint.register_endpoint("statics", view_name='static-root', view=EndpointView)

        static.register_selector(
            "file",
            ".*",
            view=StaticsServer,
            view_name='statics',
            view_config={
                'frontend': frontend_settings.FRONTEND,
                'platform': frontend_settings.PLATFORM_COLLECTION['web']
            },
            apply_slash=False
        )

"""
js = static.register_endpoint(                                      "js",
    view = StaticServer,
    view_name = 'static-js'
    )

widgets = js.register_endpoint(                                             "widgets",
    view = StaticServer,
    view_name = 'static-js'
    )

apps = js.register_endpoint(                                                "apps",
    view = StaticServer,
    view_name = 'static-js'
    )

locales = js.register_endpoint(                                             "locales",
    view = StaticServer,
    view_name = 'static-js'
    )

css = static.register_endpoint(                                       "css",
    view = StaticServer,
    view_name = 'static-js'
    )

img = static.register_endpoint(                                       "img",
    view = StaticServer,
    view_name = 'static-js'
    )
widget_endpoint = frontend_endpoint.register_endpoint(            "content",
    #view  =   ContentList,
    #view_name        =   'content-list'
)
"""
