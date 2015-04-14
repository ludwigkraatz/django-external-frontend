from django.core.management.base import BaseCommand, CommandError
#from ...utils.watch import watch_folder, watch_git
from ...builder import build, BuildError
from ...utils.stdout import WrappedOutput
from functools import partial
from optparse import make_option
import time
from django.core.management import call_command
from ...settings import settings
from app_settings.utils import override_app_settings

default_storage = {
    'CLASS': 'external_frontend.storage.VirtualStorage',
}

class Command(BaseCommand):
    args = ''
    help = 'debugs frontend with running backend via "runserver *args"'
    option_list = BaseCommand.option_list + (
        make_option('--platform',
                    action='store',
                    dest='platform',
                    default=None,
                    help='which specific plattform shall be built'),
        make_option('--frontend',
                    action='store',
                    dest='frontend',
                    default=None,
                    help='which specific plattform shall be built'),
        make_option('--no-cache',
                    action='store_true',
                    dest='ignore_cache',
                    default=False,
                    help='just output what would have been done'),
    )

    @override_app_settings(settings, {
        'STORAGE_COLLECTION': {'default': default_storage}
    })
    def handle(self, *args, **options):
        output_level = None#1  # TODO: arg
        stdout = WrappedOutput(self.stdout, self.stderr, output_level=output_level)
        selected_frontend = options.get('frontend')
        selected_platform = options.get('platform')

        try:
            stop_watching = build(
                frontends=selected_frontend,
                platforms=selected_platform,
                ignore_cache=options.get('ignore_cache'),
                watch=True,
                log=stdout
            )
        except BuildError, e:
            raise CommandError("couldn't build frontend. Error: %s" % str(e))

        serve_options = {}
        for key, value in options.items():
            if key in ['frontend', 'platform']:
                serve_options[key] = value
        call_command('runserver', *args)
        call_command('serve_frontend', **serve_options)
        stop_watching()
