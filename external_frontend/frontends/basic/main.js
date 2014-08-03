require.config({
    paths: {
        config: 'config.json',
        text: 'require-text',
        json: "json2",


        "fancyPlugin": "js/libs/requirejs/plugins/fancy-frontend/plugin/1/plugin",
        /*"text": "libs/requirejs/plugins/text/1/text",
        "json": "libs/json2/1/json2",*/

        "jquery": "fancyPlugin!lib:jquery/jquery",
        "jquery-ui": "fancyPlugin!lib:jquery/jquery-ui",
        "hawk": "fancyPlugin!lib:hawk/hawk",
    },
    "shim": {
        "jquery-ui": ["fancyPlugin!jquery"]
    },
    "structure": {
        "prefix": "{module}",
        "module": {
          "path": "{module}"
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
          "path": "/{app}/widgets/{template}/{template}{theme}.{extension}",
          "extension": "html",
          "module": "partials"
        },
        "css": {
          "path": "/{app}/widgets/{widget}/{widget}{theme}.css",
          "module": "css"
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

        for (key in frontendConfig.start.apps) {
            var instanceConfig = frontendConfig.start.apps[key];
            require( ['fancyPlugin!app:'+key], function(app) {
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
