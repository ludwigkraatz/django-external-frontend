import os
import sys
import time
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


def watch_folder(builder, stdout=None, stderr=None, stdin=None):
    # TODO: stdin = sys.stdin.read() if stdin else None
    src = builder.src

    class Handler(FileSystemEventHandler):
        #def dispatch(self, event):
        #    #event.src_path
        #    #event.is_directory
        #    #event.event_type
        #    pass

        #def on_any_event(self, event):
        #    pass

        def on_created(self, event):
            if not event.is_directory:
                with open(event.src_path, 'r') as content:
                    path = os.path.relpath(event.src_path, src)
                    stdout.write("Created: " + path)
                    builder.update(path, content.read(), log=stdout)
            pass

        def on_deleted(self, event):
            if not event.is_directory:
                path = os.path.relpath(event.src_path, src)
                stdout.write("Removed: " + path)
                builder.remove(path, log=stdout)
            pass

        def on_moved(self, event):
            if not event.is_directory:
                with open(event.dest_path, 'r') as content:
                    path = os.path.relpath(event.src_path, src)
                    dest_path = os.path.relpath(event.dest_path, src)
                    stdout.write("Moved: " + path + ' to ' + dest_path)
                    builder.remove(path, log=stdout)
                    builder.update(dest_path, content.read(), log=stdout)
            pass

        def on_modified(self, event):
            if not event.is_directory:
                with open(event.src_path, 'r') as content:
                    path = os.path.relpath(event.src_path, src)
                    stdout.write("Modified: " + path)
                    builder.update(path, content.read(), log=stdout)
            pass
    builder.load(log=stdout)

    event_handler = Handler()
    observer = Observer()
    observer.schedule(event_handler, src, recursive=True)
    observer.start()
    stdout.write("observer started:")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


def watch_git(mapper, stdout=None, stderr=None, stdin=None):
    pass
