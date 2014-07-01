from ...settings import settings
from django.core.management.base import BaseCommand, CommandError
from ...utils.watch import watch_folder, watch_git
from ...builder import FrontendBuilder


class Command(BaseCommand):
    args = ''
    help = 'builds frontend and watches for changes'

    def handle(self, *args, **options):
        started = 0
        for frontend in settings.FRONTEND_LIST:
            if not frontend.BUILDER:
                continue

            started += 1
            self.stdout.write('loading Watcher')
            storage = settings.FRONTEND.STORAGE
            if True:
                watch_folder(frontend.BUILDER, self.stdout, self.stderr, stdin=True)
            else:
                # TODO: make this "right"
                watch_git(FrontendBuilder(self.src, storage=storage), self.stdout, self.stderr, True)

        if started == 0:
            raise CommandError("didnt find any FRONTENDs with defined BUILDER")
