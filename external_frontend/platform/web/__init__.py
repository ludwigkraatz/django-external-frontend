from external_frontend.settings import settings as externalFrontendSettings
from external_frontend.platform import Platform


class Web(Platform):
    def patch_path(self, path, **config):
        path = super(Web, self).patch_path(path, **config)
        if path and externalFrontendSettings.FILES_FRONTEND_POSTFIX:
            path += '.' + config['frontend'].NAME
        return path
