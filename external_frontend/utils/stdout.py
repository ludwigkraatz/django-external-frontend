
class WrappedOutput(object):
    def __init__(self, stdout, stderr=None, indent=''):
        self.stdout = stdout
        self.stderr = stderr
        self.indent = indent

    def write(self, content, error=False):
        if not error or self.stderr is None:
            return self.stdout.write(self.get_indent() + content)
        return self.stderr.write(self.get_indent() + content)

    def get_indent(self):
        if not self.indent:
            return ''
        return self.indent + '- '

    def with_indent(self, parent=None):
        if parent:
            self.write(parent)
        return WrappedOutput(self, indent='  ')
