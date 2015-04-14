from django.db import models
import hashlib


class SourceVersionManager(models.Manager):
    def get_hash(self, kwargs):
        if 'hash' in kwargs:
            return kwargs.get('hash')

        hasher = hashlib.md5()
        hasher.update(kwargs.pop('content'))
        return str(hasher.hexdigest())

    def get(self, *args, **kwargs):
        kwargs['hash'] = self.get_hash(kwargs)
        return super(SourceVersionManager, self).get(*args, **kwargs)

    def create(self, *args, **kwargs):
        kwargs['hash'] = self.get_hash(kwargs)
        return super(SourceVersionManager, self).create(*args, **kwargs)

    def get_or_create(self, *args, **kwargs):
        kwargs['hash'] = self.get_hash(kwargs)
        return super(SourceVersionManager, self).get_or_create(*args, **kwargs)


class SourceVersion(models.Model):
    class Meta:
        unique_together = (('identifier', 'version'), )
    hash = models.TextField()
    version = models.IntegerField()
    identifier = models.TextField()

    objects = SourceVersionManager()

    def save(self, *args, **kwargs):
        if not self.version:
            matched = SourceVersion.objects.filter(identifier=self.identifier)
            if matched.count():
                self.version = matched.latest('pk').version + 1
            else:
                self.version = 1
        return super(SourceVersion, self).save(*args, **kwargs)
