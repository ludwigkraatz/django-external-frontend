paths_config = {
        text: 'js/require-text',
        json: "js/json2",
        /*"text": "libs/requirejs/plugins/text/1/text",
        "json": "libs/json2/1/json2",*/

        "jquery": "fancyPlugin!lib:jquery/jquery",
        "jquery-ui": "fancyPlugin!lib:jquery/jquery-ui",
        "hawk": "fancyPlugin!lib:hawk/hawk",
    }
for (var path in window.frontend_config.paths || {}) {
    paths_config[path] = window.frontend_config.paths[path]
}

require.config({
    baseUrl: window.frontend_config.statics_url,
    paths: paths_config,
    "shim": {
        "jquery-ui": ["fancyPlugin!jquery"]
    },
    "structure": {
        "prefix": "{module}",
        "module": {
          "path": "{module}"
        },
        "version": {
          "root": "forever/"
        },
        "plugin": {
          "path": "/libs/requirejs/plugins/{container}/{plugin}",
          "container": null
        },
        "app": {
          "path": "/{app}/{file}",
          "mainFile": "loader",
          "module": "js"
        },
        "widget": {
          "path": "/{app}/widgets/{widget}/{file}",
          "name": "widgets",
          "module": "js"
        },
        "lib": {
          "path": "/libs/{lib}",
          "module": "js"
        },
        "template": {
          "path": "/{app}/widgets/{widget}/{template}{theme}.{extension}",
          "extension": "html",
          "module": "partials"
        },
        "css": {
          "widget_path": "/{app}/widgets/{widget}/{file}{theme}.css",
          "path": "/{app}/{path}.css",
          "module": "css",
        },
        "fixture": {
          "path": "/{app}/widgets/{widget}/fixtures/{fixture}.json",
          "module": "js"
        },
        "locale": {
          "path": "/{app}/{container}/{locale}.json",
          "module": "locales",
          "container": null
        }
    }
})

// TODO: make config object selfaware. If i ask version.xyz (=undefined), it should raise an error,
// which is propagated to the user, saying the version is corrupt
// note: maybe do this within (the core) app

require(['text!config'], function(config){
    function proceed(frontendConfig){
        require.config(frontendConfig.requirejs);

        for (key in frontendConfig.start.frontends) {
            var app_name = frontendConfig.start.frontends[key],
                instanceConfig = frontendConfig.frontends[app_name];
            // require hawk here, because in dependencies it might not be loaded with fancyPlugin.
            require( ['fancyPlugin!hawk', 'fancyPlugin!app:'+app_name], function(hawk, app) {
                new app(instanceConfig);
            });
        }

    }
    if (typeof config == typeof 'string') {
        require(['json'], function(JSON){
            config = JSON.parse(config);
            proceed(config)
        })
    }else{
        proceed(config)
    }
})
