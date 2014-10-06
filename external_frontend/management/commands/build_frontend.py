from ...settings import settings
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
        )

    def handle(self, *args, **options):
        output_level = None#1  # TODO: arg
        stdout = WrappedOutput(self.stdout, self.stderr, output_level=output_level)

        started = 0
        selected_frontend = None  # TODO: as opt. argument

        pre_build_log = stdout.with_indent('pre build')
        storages = {}
        for name, frontend in settings.FRONTEND_COLLECTION.items():
            for storage in frontend.USED_STORAGE:
                storages[storage.NAME] = storage

        for storage in storages.values():
            storage_stdout = pre_build_log.with_indent('Storage: "%s"' % storage.NAME)
            storage.pre_build(
                log=storage_stdout
            )

        build_log = stdout.with_indent('build')
        for name, frontend in settings.FRONTEND_COLLECTION.items():
            main_builder = frontend.BUILDER
            if not main_builder:
                continue
            if selected_frontend and frontend.NAME != selected_frontend:
                continue

            for storage in frontend.USED_STORAGE:
                storage.build(frontend, log=build_log)  # collecting statics

            started += 1
            frontend_stdout = build_log.with_indent('Frontend: "%s"' % frontend.NAME)

            frontend_stdout.write('starting builder "%s"' % frontend.BUILDER, 'and watch for changes' if options['watch'] else '')
            if options['watch']:
                if not main_builder.watch(storages=frontend.USED_STORAGE, log=frontend_stdout):
                    frontend_stdout.write('builder "%s" couldnt start' % frontend.BUILDER.NAME)
            else:
                if not main_builder.build(storages=frontend.USED_STORAGE, log=frontend_stdout):
                    frontend_stdout.write('builder "%s" couldnt succeed' % frontend.BUILDER.NAME)

        if started == 0:
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
