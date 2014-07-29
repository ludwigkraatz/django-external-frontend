from ...settings import settings
from django.core.management.base import BaseCommand, CommandError
#from ...utils.watch import watch_folder, watch_git
from ...builder import FrontendBuilder
from ...utils.stdout import WrappedOutput
from functools import partial


class Command(BaseCommand):
    args = ''
    help = 'builds frontend and watches for changes'

    def handle(self, *args, **options):
        stdout = WrappedOutput(self.stdout, self.stderr)

        started = 0
        selected_frontend = None  # TODO: as opt. argument
        for name, frontend in settings.FRONTEND_COLLECTION.items():
            if not frontend.BUILDER:
                continue
            if selected_frontend and frontend.NAME != selected_frontend:
                continue

            started += 1
            frontend_stdout = stdout.with_indent('Frontend: "%s"' % frontend.NAME)

            frontend_stdout.write('starting builder "%s"' % frontend.BUILDER)
            if not frontend.BUILDER.run(frontend.USED_STORAGE, stdout):  # TODO: make this non-blocking
                frontend_stdout.write('builder "%" couldn\'t start' % builder.NAME)
            #if True:
            #    watch_folder(builder, frontend_stdout, stdin=True)
            #else:
            #    # TODO: make this "right"
            #    watch_git(FrontendBuilder(src=self.src, storage=None), self.stdout, self.stderr, True)

        if started == 0:
            raise CommandError("didn't find any FRONTENDs with defined BUILDER")
