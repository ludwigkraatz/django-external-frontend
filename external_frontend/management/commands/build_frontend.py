from django.core.management.base import BaseCommand, CommandError
#from ...utils.watch import watch_folder, watch_git
from ...builder import build, BuildError
from ...utils.stdout import WrappedOutput
from functools import partial
from optparse import make_option
import time


class Command(BaseCommand):
    args = ''
    help = 'builds frontend and watches for changes'
    option_list = BaseCommand.option_list + (
        make_option('--watch',
                    action='store_true',
                    dest='watch',
                    default=False,
                    help='watch frontend for changes'),
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
        make_option('--dry-run',
                    action='store_true',
                    dest='dry',
                    default=False,
                    help='just output what would have been done'),
        make_option('--no-cache',
                    action='store_true',
                    dest='ignore_cache',
                    default=False,
                    help='just output what would have been done'),
    )

    def handle(self, *args, **options):
        output_level = None#1  # TODO: arg
        stdout = WrappedOutput(self.stdout, self.stderr, output_level=output_level)
        watch = options['watch']
        dry = options['dry']
        selected_frontend = options.get('frontend')
        selected_platform = options.get('platform')

        try:
            stop_watching = build(
                frontends=selected_frontend,
                platforms=selected_platform,
                watch=watch,
                dry=dry,
                ignore_cache=options.get('ignore_cache'),
                log=stdout)
        except BuildError, e:
            raise CommandError("couldn't build frontend. Error: %s" % str(e))

        if watch:
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                stdout.write('')  # new line after KeyboardInterrupt
                stop_watching()

        stdout.write('build_frontend terminated.')
