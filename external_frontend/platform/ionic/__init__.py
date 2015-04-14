"""
ionframework.colm/getting-started/
"""
import re
import os
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


class Web(Platform):
    root_sources = '^.*ionic\.project'
    package_json = """{{
  "name": "{FRONTEND_NAME}",
  "version": "{FRONTEND_VERION}",
  "description": "{FRONTEND_NAME}: {FRONTEND_DESCRIPTION}",
  "dependencies": {{
    "gulp": "^3.5.6",
    "gulp-sass": "^0.7.1",
    "gulp-concat": "^2.2.0",
    "gulp-minify-css": "^0.3.0",
    "gulp-rename": "^1.2.0"
  }},
  "devDependencies": {{
    "bower": "^1.3.3",
    "gulp-util": "^2.2.14",
    "shelljs": "^0.3.0"
  }}
}}"""
    config_xml = """ <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<widget id="com.example.{FRONTEND_NAME}" version="{FRONTEND_VERION}" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
  <name>{FRONTEND_NAME}</name>
  <description>
       {FRONTEND_DESCRIPTION}
    </description>
  <author email="{AUTHOR_MAIL}" href="{AUTHOR_URL}">
      {AUTHOR_TEXT}
    </author>
  <content src="index.html"/>
  <access origin="*"/>
  <preference name="webviewbounce" value="false"/>
  <preference name="UIWebViewBounce" value="false"/>
  <preference name="DisallowOverscroll" value="true"/>
  <preference name="BackupWebStorage" value="none"/>
  <feature name="StatusBar">
    <param name="ios-package" value="CDVStatusBar" onload="true"/>
  </feature>
</widget>"""
    _index_html_pre_header = """
    <!-- ionic/angularjs js -->
    <script src="{IONIC_PATH}"></script>

    <!-- cordova script (this will be a 404 during development) -->
    <script src="{CORDOVA_PATH}"></script>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    """

    def generate_build_path(self, path, build_path):
        build_path = super(Web, self).generate_build_path(path, build_path)
        if build_path and not self.is_root_source(path):
            build_path = 'www' + os.path.sep + build_path
        return build_path

    def get_template_context(self, builder, **config):
        context = {}
        context['CORDOVA_PATH'] = 'cordova.js'
        context['IONIC_PATH'] = 'forever/js/libs/ionic/ionic/0/ionic.js'
        return super(Web, self).get_template_context(builder, context, **config)

    def compile(self, builder, queue, **compile_config):
        compiled = super(Web, self).compile(builder, queue, **compile_config)
        content = self.package_json.format(**self.get_template_context(builder, **compile_config))
        if content is not False:
            compile_config['content'] = content
            compile_config['path'] = None
            compile_config['new_path'] = 'package.json'
            builder.copy_src(**compile_config)
        content = self.config_xml.format(**self.get_template_context(builder, **compile_config))
        if content is not False:
            compile_config['content'] = content
            compile_config['path'] = None
            compile_config['new_path'] = 'config.xml'
            builder.copy_src(**compile_config)

    def get_static_url(self, **config):
        return '/'


class IOS(Web):
    pass


class Android(Web):
    pass

