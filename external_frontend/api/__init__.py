from ..settings import settings
from ..server import StaticsServer

for frontend in settings.FRONTEND_LIST:
    frontend_settings = settings.with_configuration({
        'FRONTEND': frontend
    })

    # TODO
    frontend_endpoint = frontend_settings.FRONTEND.ENDPOINT
    if frontend_endpoint is None:
        from introspective_api.endpoints import api_root
        frontend_endpoint = api_root.register_endpoint('frontend', namespace='frontend', active=True)

    static = frontend_endpoint.register_endpoint("static")
    static.register_selector(
        "file",
        ".*",
        view=StaticsServer,
        view_name=frontend_settings.FRONTEND.NAME.lower() + '-statics',
        view_config={
            'storage': frontend_settings.FRONTEND.STORAGE
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
"""
widget_endpoint = frontend_endpoint.register_endpoint(            "content",
    #view  =   ContentList,
    #view_name        =   'content-list'
)
