from ..settings import settings
from ..server import StaticsServer
from introspective_api.endpoints import api_root, ImproperlyConfigured

default_frontend_endpoint = None


def get_default_endpoint():
    if default_frontend_endpoint is None:
        default_frontend_endpoint = api_root.register_endpoint('frontend', namespace='frontend', active=True)
    return default_frontend_endpoint

if settings.STATICS_OVER_API:
    for name, frontend in settings.FRONTEND_COLLECTION.items():
        frontend_settings = settings.with_configuration({
            'FRONTEND': frontend
        })

        # TODO
        frontend_endpoint = frontend_settings.FRONTEND.ENDPOINT or get_default_endpoint()
        try:
            static = frontend_endpoint.register_endpoint("static")
        except ImproperlyConfigured:
            raise Exception("when multiple Frontends are defined, the ENDPOINT setting is mandatory")

        static.register_selector(
            "file",
            ".*",
            view=StaticsServer,
            view_name=name.lower() + '-statics',  # TODO: FRONTEND.PREFIX
            view_config={
                'frontend': frontend_settings.FRONTEND
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
