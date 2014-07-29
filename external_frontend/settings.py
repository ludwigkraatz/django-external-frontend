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
            'SRC': None,
            'DEPENDS_ON': [],
            'FILTER': None,
            'TYPE': None,  # lib, app, widget, css, img, partial
            'VERSION': None
        },
        'BUILDER_COLLECTION': {},
        'STORAGE': {
            'NAME': None,
            'ROOT': None,
            'FILTER': None,
        },
        'STORAGE_COLLECTION': {}
    },

    'DEFAULTS': {
        'DEBUG': django_settings.DEBUG,
        # unwrapped getter: app_settings.init.get_instance
        '_INIT_METHOD': 'app_settings.init.get_wrapped_instance',

        'FRONTEND': {
            'NAME': 'default',
            'STORAGE': 'default',
            'WORDING_HANDLER': 'default',
            'BUILDER': 'default',
        },
        'WORDINGS': {
            'NAME': 'default',
            'BACKEND': 'external_frontend.wordings.DBWordingsBackend'
        },
        'STORAGE': {
            'NAME': 'default',
            'CLASS': 'external_frontend.storage.DevelopmentStorage'
        },
        'BUILDER': {
            'CLASS': 'external_frontend.builder.FrontendBuilder',
            'DEPENDS_ON': []
        },
        'BUILDER_COLLECTION': {
            'basic-frontend': {
                'SRC': os.path.join(PROJECT_ROOT, 'frontends', 'basic'),
                #'DEPENDS_ON': ['fancy-frontend-lib'],
                'PROTECTED': True
            },
            'fancy-angular': {
                'SRC': os.path.join(PROJECT_ROOT, 'frontends', 'fancy-angular'),
                'DEPENDS_ON': ['basic-frontend'],
                'PROTECTED': True
            },
            'fancy-frontend-lib': {
                'SRC': 'git@github.com:ludwigkraatz/fancy-frontend.git',
                'FILTER': '^fancy-frontend/',
                'TYPE': 'lib',
                'PROTECTED': True
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
