from .builder import *
from .exceptions import BuildError
from ..settings import settings, InvalidSettingError

from functools import partial


def build_platform(frontend, platform, log, watch=False, dry=None, settings=settings):
    main_builder = frontend.BUILDER
    for storage in platform.USED_STORAGE:
        log.write('building Storage:', storage.NAME, storage.REQUIRES_VERSIONED)
        storage.build(frontend, log=log)  # collecting statics

    frontend_stdout = log.with_indent('Frontend: "%s":"%s"' % (frontend.NAME, platform.NAME))

    frontend_stdout.write('starting builder "%s"' % main_builder, 'and watch for changes' if watch else '')
    if watch:
        if not main_builder.watch(platform=platform, frontend=frontend, storages=platform.USED_STORAGE, log=frontend_stdout, dry=dry):
            frontend_stdout.write('builder "%s" couldnt start' % main_builder.NAME)
    else:
        if not main_builder.build(platform=platform, frontend=frontend, storages=platform.USED_STORAGE, log=frontend_stdout, dry=dry):
            frontend_stdout.write('builder "%s" couldnt succeed' % main_builder.NAME)


def prepare_storages(log, settings=settings):
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


def stop_watching(started, log=None, settings=settings):
    for frontend, platforms in started:
        main_builder = frontend.BUILDER
        for platform in platforms:
            main_builder.stop_watching(
                log=log.with_indent('stop watching "%s"."%s"' % (frontend.NAME, platform.NAME)) if log else log,
                platform=platform
            )


def build(frontends=None, platforms=None, watch=False, dry=False, log=None, ignore_cache=False, settings=settings):
    started = []
    pre_build_log = log.with_indent('pre build')
    storages = prepare_storages(log=pre_build_log, settings=settings)
    selected_frontend = frontends or 'all'
    selected_platform = platforms or 'all'
    if selected_frontend != 'all' and not isinstance(selected_frontend, (tuple, list)):
        selected_frontend = [selected_frontend]
    if selected_platform != 'all' and not isinstance(selected_platform, (tuple, list)):
        selected_platform = [selected_platform]

    build_log = log.with_indent('build')
    for name, frontend in settings.FRONTEND_COLLECTION.items():
        if selected_frontend != 'all' and frontend.NAME not in selected_frontend:
            continue
        started_platforms = []
        try:
            if not frontend.BUILDER:
                build_log.error('wont build "%s" becuase has no builder defined' % name)
                continue
        except InvalidSettingError:
            build_log.error('wont build "%s" becuase has no builder defined' % name)
            continue

        for platform in frontend.PLATFORMS:
            if selected_platform != 'all' and platform.NAME not in selected_platform:
                continue

            build_platform(frontend, platform, log=build_log, watch=watch, dry=dry, settings=settings)
            started_platforms.append(platform)
        started.append((frontend, started_platforms))

    if len(started) == 0:
        raise BuildError('couldnt find any frontends/platforms to start')

    if not watch:
        return started

    watch_log = log.with_indent('watching')

    return partial(stop_watching, started, log=watch_log, settings=settings)
