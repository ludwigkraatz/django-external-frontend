from app_settings import app_settings
from django.conf import settings as django_settings
import os

PROJECT_ROOT = os.path.dirname(__file__)


def validate_settings(attr, val):
    pass


config = {
    'NAME': 'EXTERNAL_FRONTEND',

    'SETTINGS': {
        'DEBUG': None,  # if None, it returns the global DEBUG value

        'STATICS_OVER_API': None,  # if None, returns the global DEBUG value
        'CACHE_ROOT': None,
        'API_FRONTEND_PREFIX': None,
        'FILES_FRONTEND_POSTFIX': None,
        'FRONTEND': {
            'NAME': None,
            'PREFIX': None,  # used as root folder in storage as well as in statics server name
            'STORAGE': None,
            'USED_STORAGE': [],
            #'STORAGE_METHOD': None,
            'WORDING_HANDLER': None,
            'ENDPOINT': None,
            'BUILDER': []
        },
        'FRONTEND_COLLECTION': {},
        'WORDING_HANDLER': {
            'NAME': None,
            'BACKEND': None
        },
        'WORDING_HANDLER_COLLECTION': {},
        'BUILDER': {
            'NAME': None,
            'SRC_NAME': None,
            'SRC': None,
            'DEPENDS_ON': [],
            'FILTER': None,
            'TYPE': None,  # lib, app, widget, css, img, partial
            'VERSION': None,
            'CONFIG': None
        #   'FINGERPRINT': '02:13:..'
        #   'CERT': ''
        },
        'BUILDER_COLLECTION': {},
        'STORAGE': {
            'NAME': None,
            'ROOT': None,
            'FILTER': None,
            'CLEAN_BUILD': None
        },
        'STORAGE_COLLECTION': {}
    },

    'DEFAULTS': {
        'DEBUG': django_settings.DEBUG,
        'STATICS_OVER_API': django_settings.DEBUG,
        # unwrapped getter: app_settings.init.get_instance
        '_INIT_METHOD': 'app_settings.init.get_wrapped_instance',
        'API_FRONTEND_PREFIX': 'frontend',
        'FILES_FRONTEND_POSTFIX': django_settings.DEBUG,

        'FRONTEND': {
            'NAME': 'default',
            'STORAGE': 'default',
            'WORDING_HANDLER': 'default',
            'ENDPOINT': '',
            'BUILDER': 'default',
        },
        'WORDINGS': {
            'NAME': 'default',
            'BACKEND': 'external_frontend.wordings.DBWordingsBackend'
        },
        'STORAGE': {
            'NAME': 'default',
            'CLASS': 'external_frontend.storage.DevelopmentStorage',
            'CLEAN_BUILD': True
        },
        'BUILDER': {
            'SRC_NAME': '',
            'CLASS': 'external_frontend.builder.FrontendBuilder',
            'DEPENDS_ON': [],
            'TYPE': 'frontend',
            'FILTER': '',
            'CONFIG': {}  # TODO: is it safe to use {} here?
        },
        'BUILDER_COLLECTION': {
            'introspective_api': {
                'NAME': 'introspective_api',  # TODO: settings should set this automatically
                'FILTER': '^js/libs/introspective_api/',
                'CLASS': 'external_frontend.builder.StaticsBuilder',
                'TYPE': 'lib',
                'PROTECTED': True,
                'CONFIG': {
                    'unversioned': [
                        'introspective_api/object.js',
                        'introspective_api/log.js',
                        'introspective_api/endpoint.js',
                        'introspective_api/client.js',
                    ],
                }
            },
            'basic-frontend': {
                'NAME': 'basic-frontend',
                'SRC': os.path.join(PROJECT_ROOT, 'frontends', 'basic'),
                'DEPENDS_ON': ['normalize', 'introspective_api'],
                'PROTECTED': True
            },
            'fancy-frontend': {
                'NAME': 'fancy-frontend',
                'SRC': 'https://github.com/ludwigkraatz/fancy-frontend.git@73268ea91175983f056da2982477e141f62f72bf',
                'FILTER': '^fancy-frontend/',
                'DEPENDS_ON': ['basic-frontend'],
                'TYPE': 'app',
                'PROTECTED': True
            },
            'fancy-angular': {
                'NAME': 'fancy-angular',
                #'FILTER': '^fancy-angular/',
                #'SRC_NAME': 'fancy_angular',
                'SRC': 'https://github.com/suncircle/fancy-angular.git',
                'DEPENDS_ON': ['fancy-frontend'],
                'PROTECTED': True
            },
            'normalize': {
                'NAME': 'normalize',
                'SRC': 'https://github.com/necolas/normalize.css.git',
                'FILTER': '^./normalize.css$',
                'TYPE': 'css',
                'CONFIG': {
                    'unversioned': [
                        './normalize.css'
                    ],
                    'rename': {
                        #'^./normalize.css$': './normalize.scss'
                    }
                }
            }
        }
    },

    # List of settings that may be in string import notation.
    'IMPORT_STRINGS': (
        'FRONTEND.ENDPOINT',
        #'FRONTEND.STORAGE_METHOD',
        'STORAGE.CLASS',
        'BUILDER.CLASS'
    ),

    'ONE_TO_MANY': {
        'FRONTEND': 'FRONTEND_COLLECTION|NAME',
        'STORAGE': 'STORAGE_COLLECTION|NAME',
        'BUILDER': 'BUILDER_COLLECTION|NAME',
        'WORDING_HANDLER': 'WORDING_HANDLER_COLLECTION|NAME',
        'FRONTEND.STORAGE': 'FRONTEND.USED_STORAGE',
    },

    'LINK': {
        'FRONTEND.STORAGE': 'STORAGE_COLLECTION',
        'FRONTEND.BUILDER': 'BUILDER_COLLECTION',
        'BUILDER.DEPENDS_ON': 'BUILDER_COLLECTION'
    },

    'INIT': [
        'BUILDER',
        'STORAGE'
    ],

    'GLOBALS': [
    ],

    'VALIDATION_METHOD': validate_settings
}


settings = app_settings(config)

#DEFAULTS FOR OTHER SETTINGS
"""

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'introspective_api.authentication.HawkAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': (
#        'expn_fw.contrib.api.renderers.ExpnJSONRenderer_v1_0',
#        'expn_fw.contrib.api.renderers.ExpnJSONEmbeddedResultRenderer',
        'rest_framework.renderers.JSONRenderer',
        'expn_fw.contrib.api.renderers.DynamicTemplateHTMLRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
#    'DEFAULT_CONTENT_NEGOTIATION_CLASS':
#        'expn_fw.contrib.api.negotiation.VersionNegotiation',
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
#        'expn_fw.contrib.api.parsers.EXPNVersionJSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser'
    )
}
INTROSPECTIVE_API = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'introspective_api.authentication.HawkAuthentication',
        ),
    'RESPONSE_LINK_HEADER': 'exclusive',
    'PAGINATION_IN_HEADER': True,
    'AUTH_CONSUMER_MODEL':
        'expn_fw.contrib.api.models.Consumer',
    'AUTH_ACCESS_KEY_MODEL':
        'expn_fw.contrib.api.models.AccessKey'
}


MIDDLEWARE_CLASSES = (
        
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.gzip.GZipMiddleware',
    'django.middleware.http.ConditionalGetMiddleware',
    'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    #'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.cache.FetchFromCacheMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    
    #'django.contrib.auth.middleware.AuthenticationMiddleware',
    'introspective_api.middleware.HAWK_Authentication',  
    'introspective_api.middleware.API_User_Middleware',   
    'introspective_api.middleware.API_Client_Middleware',    
    'expn_fw.contrib.terms_of_service.middleware.AcceptTOSMiddleware',
    
    
    ###'expn.base.middleware.AuthenticationMiddleware',
    #'django.contrib.messages.middleware.MessageMiddleware',
    'expn_fw.contrib.dynamic_page.middleware.ViewNameMiddleware',
    ###'expn.core.middleware.DebugException'
    #'snippetscream.ProfileMiddleware',
    #'expn.middleware.SSLMiddleware',
    #'expn.middleware.StrictAuthentication',
    #'expn.middleware.AutoLogout',
    'expn_fw.core.permissions.middleware.PermissionCheckerMiddleware',
    'expn_fw.contrib.dynamic_page.middleware.ResponseMiddleware',
)

INSTALLED APPS
    'corsheaders',
"""
