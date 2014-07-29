baseUrl = 'http://localhost:8000/api/frontend/static/js/';
require.config({
    baseUrl: baseUrl,
    paths: {
        config: 'config.json',
        text: 'require-text',
        json: "json2",
    }
})

// TODO: make config object selfaware. If i ask version.xyz (=undefined), it should raise an error,
// which is propagated to the user, saying the version is corrupt
// note: maybe do this within (the core) app

require(['text!config'], function(config){
    function proceed(config){
        require.config(config.requirejs_config);


        for (key in config.start.apps) {
            var instanceConfig = config.start.apps[key];
            require( ['fancyPlugin!app:'+key], function(app) {
                app.init(instanceConfig);
            });
        }

    }
    if (typeof config == typeof 'string') {
        require(['json'], function(json){
            config = json.parse(config);
            proceed(config)
        })
    }else{
        proceed(config)
    }
})
