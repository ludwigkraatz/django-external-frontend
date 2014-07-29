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
                    return;
                }else if ($(widgetSelector).size()>1) {
                    console.error('this app currently supports only one active widget with  ' +
                            widgetSelector)
                }
        },
        prepare_app: function(){

            /* preparing the widgets */
            var selector = this.config.selector;
            var appName = this.config.appName;

            $(selector).each(function(index, element){
                var $widget = $(element);
                $widget.html('<div class="'+appName+'-loading"></div>');

                $widget.attr('load-widget', $widget.attr('load-'+appName));
                $widget.attr('load-'+appName, undefined)
            })
        },
        init_app: function(){
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
                    angularTranslateStaticsLoader: 'fancyPlugin!app:fancy_angular:plugins/angular-locales-loader',
                    angular: "fancyPlugin!lib:angular/angular",

                    appConfig: 'fancyPlugin!app:fancy_angular:config',
                    filters: 'fancyPlugin!app:fancy_angular:filters',
                    services: 'fancyPlugin!app:fancy_angular:services',
                    directives: 'fancyPlugin!app:fancy_angular:directives',
                    controllers: 'fancyPlugin!app:fancy_angular:controllers',
                    routes: 'fancyPlugin!app:fancy_angular:routes',

                    currentApp: 'fancyPlugin!app:fancy_angular:sample_app',
                    "locale-global": 'fancyPlugin!locale:fancy_angular:locale.global',
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
                        angular.bootstrap(element, [app['name']]);
                        angular.module('config').constant('frontendCore', coreApp);
                });

                angular.resumeBootstrap();
            });
        },


        // api endpoints
        data: null,
        me: null,
        content: null,

        initEndpoints: function(){

            settings = this.config;

            this.authEndpointHost = settings.init.host;

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
            });

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


        _load_widget: function ($widget, widget_name, apply_method) {

            if (widget_name === undefined) {
                widget_name = $widget.attr('load-widget');
            }

            $[this.config.appName][widget_name]({'apply_method': apply_method}, $widget)

        }
    });
    return FrontendCore
})