
class WrappedOutput(object):
    ALL_LOGS = 9999  # TODO: as property with highest available log + 1
    INFO_LOG = 0
    DEBUG_LOG = 1
    WARNING_LOG = -1
    ERROR_LOG = -2

    def __init__(self, stdout, stderr=None, indent='', single_line=False, parent=None, async=False, output_level=None, silent=False, logging_level=None):
        """

        logging_level => tells the log what kinda logs to listen to. the logging_level doesn't change on indentation
        output_level => tells the log how deep to log, on a certain logging level. Every child log (indent) has -1 output_level
        """
        if isinstance(stdout, WrappedOutput):
            self.output = stdout
            self.stdout = 'out'
            self.stderr = 'err'
            self.log_level = self.output.log_level
        else:
            self.output = None
            self.stdout = stdout
            self.stderr = stderr
            self.log_level = logging_level or self.INFO_LOG

        self.counter = 0
        self.parent = parent
        self._async = async

        self.logging_level = logging_level or (
            self.output.logging_level if self.output else self.INFO_LOG
        )
        self.output_level = output_level
        self.silent = True if self.log_level < self.logging_level else (silent if output_level != 0 else True)

        self.indent = indent
        self.single_line = single_line if self.output_level != 0 else True
        self.was_single_line = False

    def prepareContent(self, content_list, async, single_line=None, silent=None):
        content = None
        for part in content_list:
            if content is None:
                content = str(part)
            else:
                content += ' ' + str(part)

        if single_line:
            if silent:
                content = ''
            else:
                content = content[:20]
            if content.endswith('\n'):
                content = content[:-2]
            self.counter += 1
            return self.get_indent(async) + ' > ' + "had %d logs: %s... # " % (self.counter, content)

        if content.startswith('\n'):
            content = '\033[1m%s\033[0m' % content[1:]

        return self.get_indent(async) + content

    def log(self, *content, **kwargs):
        return self._write(self.stdout, *content, **kwargs)

    def error(self, *content, **kwargs):
        if self.stderr is None:
            return self.log(*content, **kwargs)
        return self._write(self.stderr, *content)

    def write(self, *args, **kwargs):
        if kwargs.pop('error', False):
            return self.error(*args, **kwargs)
        return self.log(*args, **kwargs)

    def _write(self, stdout, *content, **kwargs):
        single_line = self.single_line or kwargs.pop('single_line', False)
        silent = self.silent or kwargs.get('logging_level', self.logging_level) > self.log_level
        if silent and not single_line:
            return

        async = kwargs.pop('async', self._async)
        data = self.prepareContent(content, async=async, single_line=single_line, silent=silent)

        if self.output is None:
            if isinstance(stdout, basestring):
                stdout = getattr(self, 'std'+stdout)

            if single_line:
                #if self.was_single_line:
                #    stdout.write("\033[F")
                # if hasattr(stdout, 'isatty') and stdout.isatty():
                #stdout.write(data)
                #stdout.write(data, ending="\r")
                #stdout.write("%s\r" % data.__str__(), ending='')
                stdout.write("\r%s\033[K" % data, ending='')
                #stdout.write("\r\x1b[K"+data.__str__(), ending="")
                #stdout.write("\033[K")  # clean line
                #sys.stdout.write("\033[F") # Cursor up one line
                stdout.flush()
                self.was_single_line = True
                #stdout.write('')
            else:
                if self.was_single_line:
                    stdout.write('')
                    self.was_single_line = False
                stdout.write(data)

        else:
            self.output._write(stdout, data, single_line=single_line, async=async)

    def get_indent(self, async):
        if async:
            return (self.parent or '') + ' - '
        else:
            if not self.indent:
                return ''
            return self.indent + '- '

    def with_indent(self, parent=None, single_line=False, logging_level=None):
        if parent:
            self.write(parent, logging_level=logging_level)
        return WrappedOutput(self, indent='  ', single_line=single_line, parent=parent, async=self._async, silent=self.silent, output_level=(self.output_level-1) if self.output_level else self.output_level, logging_level=logging_level)

    def async(self, parent=None, single_line=False, logging_level=None):
        return WrappedOutput(self, indent='  ', parent=parent, single_line=single_line, async=True, silent=self.silent, output_level=(self.output_level-1) if self.output_level else self.output_level, logging_level=logging_level)
