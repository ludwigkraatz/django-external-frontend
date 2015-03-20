from ...settings import settings, InvalidSettingError
from django.core.management.base import BaseCommand, CommandError
#from ...utils.watch import watch_folder, watch_git
from ...builder import FrontendBuilder
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
    )

    def build_platform(self, frontend, platform, log, watch=False, dry=None):
        main_builder = frontend.BUILDER
        for storage in platform.USED_STORAGE:
            storage.build(frontend, log=log)  # collecting statics

        frontend_stdout = log.with_indent('Frontend: "%s":"%s"' % (frontend.NAME, platform.NAME))

        frontend_stdout.write('starting builder "%s"' % main_builder, 'and watch for changes' if watch else '')
        if watch:
            if not main_builder.watch(platform=platform, storages=platform.USED_STORAGE, log=frontend_stdout, dry=dry):
                frontend_stdout.write('builder "%s" couldnt start' % main_builder.NAME)
        else:
            if not main_builder.build(platform=platform, storages=platform.USED_STORAGE, log=frontend_stdout, dry=dry):
                frontend_stdout.write('builder "%s" couldnt succeed' % main_builder.NAME)

    def prepare_storages(self, log):
        storages = {}
        for name, platform in settings.PLATFORM_COLLECTION.items():
            for storage in platform.USED_STORAGE:
                storages[storage.NAME] = storage

        for storage in storages.values():
            storage_stdout = log.with_indent('Storage: "%s"' % storage.NAME)
            storage.pre_build(
                log=storage_stdout
            )
        return storages

    def handle(self, *args, **options):
        output_level = None#1  # TODO: arg
        stdout = WrappedOutput(self.stdout, self.stderr, output_level=output_level)

        started = []
        selected_frontend = options.get('frontend') or 'all'
        selected_platform = options.get('platform') or 'all'

        pre_build_log = stdout.with_indent('pre build')
        storages = self.prepare_storages(log=pre_build_log)

        build_log = stdout.with_indent('build')
        for name, frontend in settings.FRONTEND_COLLECTION.items():
            if selected_frontend != 'all' and frontend.NAME != selected_frontend:
                continue
            try:
                if not frontend.BUILDER:
                    build_log.error('wont build "%s" becuase has no builder defined' % name)
                    continue
            except InvalidSettingError:
                build_log.error('wont build "%s" becuase has no builder defined' % name)
                continue

            for platform in frontend.PLATFORMS:
                if selected_platform != 'all' and platform.NAME != selected_platform:
                    continue

                self.build_platform(frontend, platform, log=build_log, watch=options['watch'], dry=options['dry'])
                started.append((frontend, platform))

        if len(started) == 0:
            raise CommandError("didn't find any FRONTENDs with defined BUILDER")
        else:
            if options['watch']:
                watch_log = stdout.with_indent('watching')

                try:
                    while True:
                        time.sleep(1)
                except KeyboardInterrupt:
                    stdout.write('')  # new line after KeyboardInterrupt
                    for name, frontend in settings.FRONTEND_COLLECTION.items():
                        main_builder = frontend.BUILDER
                        main_builder.stop_watching(
                            log=watch_log.with_indent('stop watching "%s"' % name)
                        )

        stdout.write('build_frontend terminated.')
