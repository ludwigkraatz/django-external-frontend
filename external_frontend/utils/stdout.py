
class WrappedOutput(object):
    def __init__(self, stdout, stderr=None, indent='', single_line=False, parent=None, async=False):
        if isinstance(stdout, WrappedOutput):
            self.output = stdout
            self.stdout = 'out'
            self.stderr = 'err'
        else:
            self.output = None
            self.stdout = stdout
            self.stderr = stderr
        self.indent = indent
        self.single_line = single_line
        self.was_single_line = False
        self.counter = 0
        self.parent = parent
        self._async = async

    def prepareContent(self, content_list, async):
        content = None
        for part in content_list:
            if content is None:
                content = str(part)
            else:
                content += ' ' + str(part)

        if self.single_line:
            content = content[:20]
        if content.startswith('\n'):
            content = '\033[1m%s\033[0m' % content[1:]

        if self.single_line:
            if content.endswith('\n'):
                content = content[:-2]
            self.counter += 1
            return self.get_indent(async) + "had %d logs: %s... # " % (self.counter, content)
        return self.get_indent(async) + content

    def log(self, *content):
        return self._write(self.stdout, *content)

    def error(self, *content):
        if self.stderr is None:
            return self.log(*content)
        return self._write(self.stderr, *content)

    def write(self, *args, **kwargs):
        if kwargs.pop('error', False):
            return self.error(*args, **kwargs)
        return self.log(*args, **kwargs)

    def _write(self, stdout, *content, **kwargs):
        async = kwargs.pop('async', self._async)
        data = self.prepareContent(content, async)
        single_line = self.single_line or kwargs.pop('single_line', False)

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

    def with_indent(self, parent=None, single_line=False):
        if parent:
            self.write(parent)
        return WrappedOutput(self, indent='  ', single_line=single_line, parent=parent, async=self._async)

    def async(self, parent=None, single_line=False):
        return WrappedOutput(self, indent='  ', parent=parent, single_line=single_line, async=True)
