from app_settings import app_settings
from django.conf import settings as django_settings


def validate_settings(attr, val):
    pass


config = {
    'NAME': 'EXTERNAL_FRONTEND',

    'SETTINGS': {
        'DEBUG': None,  # if None, it returns the global DEBUG value
        'FRONTEND': {
            'NAME': None,
            'STORAGE': None,
            'STORAGE_METHOD': None,
            'SRC': None,
            'ROOT': None,
            'WORDING_HANDLER': None,
            'ENDPOINT': None,
            'BUILDER': None
        },
        'FRONTEND_LIST': [],
        'WORDING_HANDLER': {
            'NAME': None,
            'BACKEND': None
        },
        'WORDING_HANDLER_LIST': [],
        'MAPPER': {
            'NAME': None,
        },
        'MAPPER_LIST': [],
        'BUILDER': {
            'NAME': None,
            'CLASS': None,
            'SRC': None,
        },
        'BUILDER_LIST': [],
        'STORAGE': {
            'NAME': None,
            'CLASS': None,
            'ROOT': None
        },
        'STORAGE_LIST': []
    },

    'DEFAULTS': {
        'DEBUG': django_settings.DEBUG,
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
        'STORAGE': {  # takes also a list of dictionaries if more than one mapper is needed
            'NAME': 'default',
            'CLASS': 'external_frontend.storage.DevelopmentStorage'
        },
        'BUILDER': {
            'NAME': 'default',
            'CLASS': 'external_frontend.builder.FrontendBuilder'
        }
    },

    # List of settings that may be in string import notation.
    'IMPORT_STRINGS': (
        #'FRONTEND.STORAGE',
        'FRONTEND.ENDPOINT',
        'FRONTEND.STORAGE_METHOD',
        'STORAGE.CLASS',
        'BUILDER.CLASS'
    ),

    'ONE_TO_MANY': {
        'FRONTEND': 'FRONTEND_LIST',
        'STORAGE': 'STORAGE_LIST',
        'BUILDER': 'BUILDER_LIST',
        'MAPPER': 'MAPPER_LIST',
        'WORDING_HANDLER': 'WORDING_HANDLER_LIST'
    },

    'LINK': {
        'FRONTEND.STORAGE': 'STORAGE_LIST|NAME',
        'FRONTEND.BUILDER': 'BUILDER_LIST|NAME'
    },

    'INIT': {
        'STORAGE': 'app_settings.init.get_class_from_config',
        'BUILDER': 'app_settings.init.get_class_from_config'
    },

    'VALIDATION_METHOD': validate_settings
}


settings = app_settings(config)
