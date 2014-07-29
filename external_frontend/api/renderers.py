from introspective_api.renderers import *
from django.conf import settings
#import six
import json


class JSRenderer(BaseRenderer):
    """
    Plain text parser.
    """
    media_type = 'application/javascript'
    format = 'js'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        if isinstance(data, dict):
            if 'js' in data:
                return data['js']

        if hasattr(data, 'js'):
            if callable(data.js):
                return data.js()
            return data.js

        return str(data)


class CSSRenderer(BaseRenderer):
    """
    Plain text parser.
    """
    media_type = 'text/css'
    format = 'css'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        if isinstance(data, dict):
            if 'css' in data:
                return data['css']

        if hasattr(data, 'css'):
            if callable(data.css):
                return data.css()
            return data.css

        return str(data)


class requirejsFallbackRenderer(JSONRenderer):
    """
    Plain text parser.
    """
    media_type = 'application/javascript'
    format = 'json.js'

    def render(self, *args, **kwargs):
        data = super(requirejsFallbackRenderer, self).render(*args, **kwargs)

        # TODO: quote escape
        return 'define(function(){return ' + data + '});'


class requirejsFallbackHTMLRenderer(JSONRenderer):
    """
    Plain text parser.
    """
    media_type = 'application/javascript'
    format = 'html.js'

    def render(self, *args, **kwargs):
        data = super(requirejsFallbackHTMLRenderer, self).render(*args, **kwargs)

        # TODO: quote escape
        return 'define(function(){return ' + data + '});'


# no good solution..
class PngRenderer(BaseRenderer):
    """
    Plain image parser.
    """
    media_type = 'image/png'
    format = 'png'

    def render(self, data, *args, **kwargs):
        return data
class GifRenderer(BaseRenderer):
    """
    Plain image parser.
    """
    media_type = 'image/gif'
    format = 'gif'

    def render(self, data, *args, **kwargs):
        return data
class SvgRenderer(BaseRenderer):
    """
    Plain image parser.
    """
    media_type = 'image/svg'
    format = 'svg'

    def render(self, data, *args, **kwargs):
        return data


# JSONRenderer is defined last
class JSONRenderer(JSONRenderer):
    """
    Plain text parser.
    """

    def render(self, data, *args, **kwargs):

        return data


class ApiRenderer(BrowsableAPIRenderer):
    pass
