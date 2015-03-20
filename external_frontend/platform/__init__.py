import os


class Platform(object):
    def __init__(self, **kwargs):
        self.name = kwargs['settings'].NAME

    def patch_path(self, path, **config):
        if True:  # TODO: externalFrontendSettings.PATCH_PATH:
            path = os.path.join(self.name, path)
        return path
