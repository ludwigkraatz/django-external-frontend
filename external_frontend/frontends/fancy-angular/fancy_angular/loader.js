define(['fancyPlugin!jquery', 'fancyPlugin!fancyFrontendCore'], function($, core){
    function FrontendCore() {
        this.init.apply(this, arguments);
    }

    /* prototype extension */
    $.extend(FrontendCore.prototype, core.prototype);
    $.extend(FrontendCore.prototype, {
        validate_app: function(){

                var widgetSelector = this.config.selector;
                if ($(widgetSelector).size() == 0){
                    console.warn('no element with '+widgetSelector+' found.');
                    return false;
                }else if ($(widgetSelector).size()>1) {
                    console.error('this app currently supports only one active widget with  ' +
                            widgetSelector)
                    return false;
                }
            return true;
        },
        prepare_app: function(){
            var $this = this;
            /* preparing the widgets */
            var selector = this.config.selector;
            var appName = this.config.appName;
            var namespace = this.config.widgets.namespace;

            $(selector).each(function(index, element){
                var $widget = $(element);
                var widgetName = $widget.attr('load-'+appName);
                //$widget.html('<div class="'+appName+'-loading"></div>');

                //$this.create_widget($widget, namespace+'.'+widgetName)
                $widget.attr('load-widget', namespace+'.'+widgetName);
                $widget.attr('load-'+appName, undefined);
            })
        },
        _init_app: function(){
            var coreApp = this;
            config = {
                "defaults": {
                    angularRoute: 'fancyPlugin!lib:angular/angular-route',
                    angularAnimate: 'fancyPlugin!lib:angular/angular-animate',
                    angularMocks: 'fancyPlugin!lib:angular/angular-mocks',
                    angularTranslate: 'fancyPlugin!lib:angular/translate/v2/translate',
                    angularTranslateService: 'fancyPlugin!lib:angular/translate/v2/service/translate',
                    angularTranslateServiceInterpolation: 'fancyPlugin!lib:angular/translate/v2/service/default-interpolation',
                    angularTranslateServiceLog: 'fancyPlugin!lib:angular/translate/v2/service/handler-log',
                    angularTranslateServiceStorage: 'fancyPlugin!lib:angular/translate/v2/service/storage-key',
                    angularTranslateFilter: 'fancyPlugin!lib:angular/translate/v2/filter/translate',
                    angularTranslateDirective: 'fancyPlugin!lib:angular/translate/v2/directive/translate',
                    angularTranslateStaticsLoader: 'fancyPlugin!app:fancy-angular:plugins/angular-partial-locales-loader',
                    angular: "fancyPlugin!lib:angular/angular",
                    cookie: "fancyPlugin!lib:jquery/jquery.cookie",

                    appConfig: 'fancyPlugin!app:fancy-angular:config',
                    filters: 'fancyPlugin!app:fancy-angular:filters',
                    services: 'fancyPlugin!app:fancy-angular:services',
                    directives: 'fancyPlugin!app:fancy-angular:directives',
                    controllers: 'fancyPlugin!app:fancy-angular:controllers',
                    routes: 'fancyPlugin!app:fancy-angular:routes',

                    currentApp: 'fancyPlugin!app:fancy-angular:sample_app',
                    "locale-global": 'fancyPlugin!locale:fancy-angular:locale.global',
                },
                shim: {
                    'angular' : {
                        'exports' : 'angular'
                    },
                    'angularRoute': ['fancyPlugin!angular'],
                    'angularTranslate': ['fancyPlugin!angular'],
                    'angularTranslateServiceInterpolation': ['fancyPlugin!angularTranslate'],
                    'angularTranslateServiceLog': ['fancyPlugin!angularTranslate'],
                    'angularTranslateServiceStorage': ['fancyPlugin!angularTranslate'],
                    'angularTranslateService': [
                        'fancyPlugin!angularTranslate',
                        'fancyPlugin!angularTranslateServiceInterpolation',
                        'fancyPlugin!angularTranslateServiceLog',
                        'fancyPlugin!angularTranslateStaticsLoader',
                        'fancyPlugin!angularTranslateServiceStorage'
                    ],
                    'angularTranslateFilter': ['fancyPlugin!angularTranslate'],
                    'angularTranslateDirective': ['fancyPlugin!angularTranslate'],
                    'angularAnimate': ['fancyPlugin!angular'],
                    'angularMocks': {
                        deps: ['fancyPlugin!angular'],
                        'exports': 'angular.mock'
                    }
                },
                priority: [
                    "fancyPlugin!angular",
                    "fancyPlugin!jquery",
                    "fancyPlugin!angularTranslate",
                ],
                config: {}
            }
            /*config.config[this.config.appName] = {
                'currentApp': this.config.appName,
                'htmlUrl': this.config.htmlUrl || '',
                'localesUrl': this.config.localesUrl || ''
            }*/

            require.config(config);
            config = this.config;

            //http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
            window.name = "NG_DEFER_BOOTSTRAP!";

            require( [
                'fancyPlugin!jquery',
                'fancyPlugin!angular',
                'fancyPlugin!currentApp',
                'fancyPlugin!appConfig',
                'fancyPlugin!routes',
            ], function($, angular, app){
                'use strict';
                $(config.selector).each(function(index, element){
                        // telling angular to handle this widget as a single-view-app
                        //$(element).attr('ng-animate', " 'animate' ");
                        //$(element).attr('ng-view', '');
                        //$(element).attr('ng-bind-html', 'activeContent');
                        //$(element).attr('ng-include', '"http://localhost:8000/js/widgets/survey/partials/survey/v1/survey.html"')
                        $(element).attr('ng-keydown', '_ctrlModeActive = $event.altKey');
                        $(element).attr('ng-keyup', '_ctrlModeActive = $event.altKey');
                        $(element).attr('ng-class', '_ctrlModeActive ? "'+coreApp.config.appName+'-interaction-reveal" : ""');
                        angular.bootstrap(element, [app['name']]);
                        angular.module('config').constant('frontendCore', coreApp);
                        coreApp.$root_element = element;
                });

                angular.resumeBootstrap();
            });
        },


        // api endpoints
        data: null,
        me: null,
        content: null,

        initEndpoints: function(callback){

            settings = this.config;
            this.log('(init)', '[frontendCore]:', this);
            this.authEndpointHost = settings.init.host;

            this.endpoint = this.new_ajax({
                endpoint:   settings.init.host,
                crossDomain: settings.init.crossDomain,
                log: this.__log,
                callback: callback
            });
            /*
            this.data = this.new_ajax({
                endpoint:   settings.init.host,
                type:       'data',
                crossDomain: settings.init.crossDomain
            });
            this.me = this.new_ajax({
                endpoint:   settings.init.host,
                type:       'me',
                crossDomain: settings.init.crossDomain
            });
            this.content = this.new_ajax({
                endpoint:   settings.init.content_host,
                type:       'content',
                crossDomain: settings.init.crossDomain,
                external:   true
            });*/

        },

        setCredentials: function(response) {
                var accessId = response.accessId;
                var accessSecret = response.accessSecret;
                var accessAlgorithm = response.accessAlgorithm;

                this.data.setCredentials(
                    accessId,
                    accessSecret
                );
                this.data.setAlgorithm(
                    accessAlgorithm
                );
                this.me.setCredentials(
                    accessId,
                    accessSecret
                );
                this.me.setAlgorithm(
                    accessAlgorithm
                );
                this.content.setCredentials(
                    accessId,
                    accessSecret
                );
                this.content.setAlgorithm(
                    accessAlgorithm
                );

        },


        _load_widget: function ($widget, response, widget_name, js, scope) {
            if (widget_name === undefined) {
                widget_name = $widget.attr('load-widget');
            }
            if (widget_name.search(':') != -1) {
                widget_name = widget_name.split(':')[0]
            }
            
            $widget.attr('data-' + this.config.prefix + '-widget-name', widget_name); // .slice(widget_name.search('>')+1)

            var options = this.get_options($widget[0]);
            if ($widget[0] == this.$root_element) {
                this.setScope(scope);
            }
            options['widgetCore'] = this;
            options['scope'] = scope;
            options['content'] = options['content'] || response;
            options['activeView'] =  scope.__defaultWidgetView;

            if ($widget.data('__initialized')){
                js('options', options)
            }else{
                if (!js) {
                    return false
                }
                js(options, $widget)
            }

        },
        
        load_dependencies: function(settings){
            for (var key in settings.templates){
                var template = 'fancyPlugin!template:' + (settings.templates[key]+':'+settings.templates[key]);
                settings.scope.__required.push(template);
                require([template], function(response){
                    if (settings.callback){
                        settings.callback('template', settings.templates[key], response);
                    }
                });
            }
            for (var key in settings.locales){
                settings.scope.addLocale(settings.locales[key]);
                //if (promise.required) settings.scope.__required.push(promise.required);
                // TODO: enable tracking of required locales
                if (settings.callback){settings.callback('locale', settings.locales[key])};
                
            }
            for (var key in settings.css){
                // TODO: test if file is not loaded with core.css
                var css = 'fancyPlugin!css:' + (settings.css[key]);
                settings.scope.__required.push(css);
                require([css], function(response){
                    if (settings.callback){
                        settings.callback('css', settings.css[key], response);
                    }
                });
            }
            for (var key in settings.fixtures){
                settings.scope.loadFixture(settings.fixtures[key]);
                var fixture = 'fancyPlugin!fixture:' + (settings.fixtures[key]+':'+settings.fixtures[key]);
                settings.scope.__required.push(fixture);
                require([fixture, 'fancyPlugin!angular', 'fancyPlugin!currentApp', 'fancyPlugin!services'], function(fixture, angular, app){
                    settings.scope.log.event('loaded fixture', settings.fixtures[key], fixture)
                    settings.scope.addFixture(settings.fixtures[key], fixture)
                    settings.scope.$apply();
                    if (settings.callback){
                        settings.callback('fixture', settings.fixtures[key], fixture);
                    }
                });
            }
        }
    });
    return FrontendCore
})