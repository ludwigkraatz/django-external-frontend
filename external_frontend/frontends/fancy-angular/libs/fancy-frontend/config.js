define(['fancyPlugin!jquery', 'fancyPlugin!fancyFrontendConfigFile', 'json'], function($, config, json){
    function load_config(){
        // TODO: add default values
        function Config() {
            this.init.apply(this, arguments);
        }
        $.extend(Config.prototype, {
            init: function(){},
            "frontend_generateName": function(name){
                return this.frontend_generateFunctionName(name)
            },
            "frontend_generateSelector": function(name, selectorType){
                if (selectorType === undefined) {
                    selectorType = 'class'
                }
                if (selectorType == 'class') {
                    return "." + this.frontend_prefix_css() + name
                }else if (selectorType == 'id') {
                    return '#' + this.frontend_prefix_css() + name
                }else{
                    throw Error('unknown SelectorType "' + selectorType + '"')
                }
            },
            "frontend_generateFunctionName": function(name){
                return name
            },
            "frontend_prefix_js": function(){
                return this.widgets.prefix + "_"
            },
            "frontend_prefix_css": function(){
                return this.widgets.prefix + "-"
            },
            "frontend_generateEventName": function(name){
                return this.frontend_generateClassName(name)
            },
            "frontend_generateEventSelector": function(name, selectorType){
                return "." + this.frontend_prefix_css() + name
            },
            "frontend_generateClassName": function(name){
                if (name.search("ui:") != -1){
                    return this.css.namespaces.ui.prefix + name
                }
                return this.frontend_prefix_css() + name
            },
            "frontend_generateAttributeName": function(name){
                return "data-" + this.frontend_prefix_css() + name
            },
            "frontend_generateWording": function(id){
                return this.dialog_generateWording(id)
            },
            "dialog_generateWording": function(id){
                return "{{ " + id.replace(":", ",").toUpperCase() + " | translate }}"
            },
            "frontend_generateResponseAttributeName": function(name){
                return this.frontend_prefix_css() + name
            },
            'frontend_generateErrorCode': function(name){
                return this.frontend.generateClassName(name)
            }
            });

        if (typeof config == typeof 'string') {
            config = JSON.parse(config);
        }
        if (config.widgets.defaults === undefined) {
            config.widgets.defaults = {};
        }
        $.extend(config.widgets.defaults, {
            "editor": {
                "name": "editor",
                "css": "editor"
            },

            "list": {
                "name": "list",
                "css": "list"
            },

            "core": {
                "name": "core",
                "css": "core"
            },

            "form": {
                "name": "form",
                "css": "form"
            },

            "popup": {
                "name": "popup",
                "css": "popup-window"
            }
        });
        $.extend(Config.prototype, config);
        return new Config()
    }
    return load_config()
});