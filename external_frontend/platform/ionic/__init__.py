"""
ionframework.colm/getting-started/
"""
from external_frontend.platform import Platform


def build(platforms=None):
    os.call('npm install -g cordova ionic')
    os.call('ionic start myApp tabs')
    os.call('cd myApp')
    for platfrom in platforms or ['ios', 'android']:
        os.call('ionic platform add ' + platfrom)
        os.call('ionic platform build ' + platfrom)
        os.call('ionic platform emulate ' + platfrom)

def serve():
    os.call('ionic serve')

def export():
    
    os.call('ionic login')
    os.call('ionic upload')


class IOS(Platform):
    pass


class Android(Platform):
    pass

