import os
from storages.backends.s3boto import S3BotoStorage
from django.utils.encoding import filepath_to_uri
from django.conf import settings

os.environ['S3_USE_SIGV4'] = 'True'


class S3Storage(S3BotoStorage):
    @property
    def connection(self):
        if self._connection is None:
            self._connection = self.connection_class(
                self.access_key, self.secret_key,
                calling_format=self.calling_format, host='s3.eu-central-1.amazonaws.com')
        return self._connection


class MediaStorage(S3Storage):
    url_protocol = (settings.MEDIA_URL.split('://')[0] + ':') if '://' in settings.MEDIA_URL else S3Storage.url_protocol
    custom_domain = settings.MEDIA_URL.split('://')[-1] if not settings.MEDIA_URL.split('://')[-1].endswith('/') else settings.MEDIA_URL.split('://')[-1][:-1]
    location = settings.MEDIA_ROOT

    def url(self, name, *args, **kwargs):
        # Preserve the trailing slash after normalizing the path.
        if self.custom_domain:
            return "%s//%s/%s" % (self.url_protocol,
                                  self.custom_domain, filepath_to_uri(self._clean_name(name)))
        return super(MediaStorage, self).url('../' + name, *args, **kwargs)
