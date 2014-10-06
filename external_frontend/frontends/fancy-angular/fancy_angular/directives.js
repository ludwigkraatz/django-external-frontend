define([
        'fancyPlugin!appConfig',
        'fancyPlugin!angular',
        'fancyPlugin!services',
        'fancyPlugin!fancyWidgetCore',
        'fancyPlugin!fancyFrontendConfig',
        'fancyPlugin!angularTranslateService'
    ], function(widgetCore, angular, services, $, frontendConfig) {
//	'use strict';

  /* Directives */

function isDefined(args) {
    return args !== undefined
}

function prepareController($injector, $scope, $parentScope, jsConfig, widgetConfig, frontendCore){
    var $ObjectProvider = $injector.get('$ObjectProvider'),
        $fancyAngularLocalesLoader = $injector.get('$fancyAngularLocalesLoader'),
        $translate = $injector.get('$translate'),
        $compile = $injector.get('$compile'),
        $q = $injector.get('$q');
    
    $scope.apply = function(rawContent, callback) {
        var content = angular.element(rawContent);
        var compiled = $compile(content);

        // first call callback, so elements are attached to DOM
       if (callback){callback(content);}
        
        // then execute compiled
        compiled($scope);
        $scope.$apply();
        $scope.$emit('applied');
    };
    $scope.__log_storage = [];
    $scope.log = {
        __storage : [],
        error: function(){
            if (true) {
                $scope.log.__storage.push({type: 'error', timestamp:new Date().getTime(), content:Array.prototype.slice.call(arguments), stack:new Error().stack})
            }else{
                console.error.apply(console, arguments)
            }
        },
        success: function(){
            if (true) {
                $scope.log.__storage.push({type: 'success', timestamp:new Date().getTime(), content:Array.prototype.slice.call(arguments), stack:new Error().stack})
            }else{
                console.error.apply(console, arguments)
            }
        },
        info: function(){
            if (true) {
                //console.log('-->',arguments.callee.caller.name,arguments.callee.caller.arguments.callee.caller.name)
                $scope.log.__storage.push({type: 'info', timestamp:new Date().getTime(), content:Array.prototype.slice.call(arguments), stack:new Error().stack})
            }else{
                console.log.apply(console, arguments)
            }
        },
        debug: function(){
            if (true) {
                $scope.log.__storage.push({type: 'debug', timestamp:new Date().getTime(), content:Array.prototype.slice.call(arguments), stack:new Error().stack})
            }else{
                console.log.apply(console, arguments)
            }
        },
        warn: function(){
            if (true) {
                $scope.log.__storage.push({type: 'warning', timestamp:new Date().getTime(), content:Array.prototype.slice.call(arguments), stack:new Error().stack})
            }else{
                console.log.apply(console, arguments)
            }
        }
    }
    
    $scope.__required = widgetConfig.required;
    $scope.unload_required = function(callback){
        var fancyRequirements = [];
        for (var key in $scope.__required) {
            if ($scope.__required[key].slice(0,12) == 'fancyPlugin!') {
                fancyRequirements.push($scope.__required[key] + '?');
            }
            requirejs.undef($scope.__required[key])
            $scope.log.debug('removed cached requirement', $scope.__required[key])
        }
        if (fancyRequirements.length) {
            // get the url(s) from fancyPlugin
            require(fancyRequirements, function(){
                for (key in arguments){
                    requirejs.undef(arguments[key])
                }
                if (callback)callback()
            })
        }else{
            if (callback)callback()
        }
    };
    $scope.__widgetType = widgetConfig.widgetType;
    $scope.__defaultWidgetView = widgetConfig.widgetView;
    $scope.__widgetData = widgetConfig.widgetResource ? (widgetConfig.widgetResource): null;
    $scope.__widgetReference = widgetConfig.widgetReference;
    $scope.__widgetResource = widgetConfig.widgetResource;
    $scope.__widgetResourceList = null;
    $scope.__target = $scope.__widgetReference ? 'relationship' : 'uuid';
    $scope.__widgetIdentifier = widgetConfig.widgetIdentifier
    $scope.generateIdentifier = function(){
        return $scope.__widgetIdentifier + (
                    $scope.__defaultWidgetView ? '#' + $scope.__defaultWidgetView : ''
                );
        $scope.__widgetType + (
                    $scope.__widgetData ? ':' + $scope.__widgetData : ''
                ) + (
                    $scope.__defaultWidgetView ? '#' + $scope.__defaultWidgetView : ''
                )
    };
    if (!widgetConfig.plugin) {
        $scope.resource = {};
        $scope.resourceList = [];
        $scope.log.debug('init _resource scope', $scope)
        $scope._resource = undefined;
        $scope._resourceList = undefined;
    }

    for (var key in jsConfig) {$scope.log.debug('jsConfig: ', key, jsConfig[key])
        $scope[key] = jsConfig[key];
    }
    $scope.__fixtures = {};
    $scope.addLocale = function(name){
        return $fancyAngularLocalesLoader.addPart(name);
    };
    $scope.addFixture = function(name, content){
        $scope.log.debug('updating fixture "', name, '" with', content)
        $scope.__fixtures[name] = content;
        $scope.initResource({force_update: false});
        //$ObjectProvider.setFixture(name, content);
    };
    $scope.loadFixture = function(name){$scope.log.debug('loadig fixture', name)
        $scope.__fixtures[name] = undefined;
    };
    
    $scope.object = function(settings){
        var provider, fixture;
        $scope.log.debug('getting object', settings, 'fixtures:', $scope.__fixtures);
        
        if (settings.target == 'relationship' && $scope.__widgetResourceList) {
            $scope.log.debug('found relationship in parent');
            fixture = $scope.__widgetResourceList;
        }
        if (!fixture) {
            for (var name in $scope.__fixtures){
                if ($scope.__fixtures[name] === undefined) {$scope.log.debug('fixture "', name, '" stil loading')
                    return undefined // wait until all fixtures are loaded
                }
                for (var key in $scope.__fixtures[name]){
                    var _fixture = $scope.__fixtures[name][key];
                    if (settings.target == 'relationship') {
                        if (_fixture.uuid == $parentScope.__wdigetResource && _fixture[settings.data]) {
                            $scope.log.debug('found relationship in fixture');
                            fixture = _fixture[settings.data];
                            break;
                        }
                    }else{   
                        /*var _data = settings.data;
                        if (!_data instanceof Array) {
                            _data = [_data]
                        }
                        for (var data in _data) {
                            if (_fixture.uuid == settings.data) {
                                if (fixture === null) {
                                    fixture = []
                                }
                                console.log('found uuid fixture');
                                fixture.push(_fixture);
                            }
                        }
                        if (fixture) {
                            break;
                        }*/
                        if (_fixture.uuid == settings.data) {
                            $scope.log.debug('found uuid fixture');
                            fixture = _fixture;
                            break;
                        }
                    }
                }
            }
        }
        
        if (settings.target == 'relationship') {
            settings['initialContent'] = $scope['resourceList'];
            if (!$parentScope['_resource']) {
                return undefined // wait until parent has loaded
            }
            $scope.log.debug('parentScope', settings)
            provider = $parentScope['_resource'].get.apply($parentScope['_resource'], [settings])
        }else{
            if (settings.data === undefined) {
                return undefined
            }
            settings['initialContent'] = $scope['resource'];
            provider = $ObjectProvider.get(settings) //@currentScope.__widgetType
        }
        return fixture ? provider.fromFixture(fixture) : provider
    };
    
    $scope.updateResource = function (resource) {
        if (resource && resource.__path && resource.__path.target) {
            if (resource.__path.target == 'relationship') {
                if ($scope['_resourceList'] !== resource) {
                    $scope.log.debug(' updating resourceList', resource, $scope['_resourceList'])
                    $scope['_resourceList'] = resource;
                }
            }else{
                if ($scope['_resource'] !== resource) {
                    $scope.log.debug(' updating resource', resource, $scope['_resource'])
                    $scope['_resource'] = resource;
                }
            }
            return resource
        }
        $scope.log.debug(' updating failed', resource, 'has no __path.target')
        return undefined
    }
    
    $scope.initResource = function (settings) {
        var data,
            target = $scope.__target;
        if (target == 'relationship'){
            data = $scope.__widgetReference
        }else{
            target = target  || 'uuid';
            data = $scope.__widgetResource;
        }
        return $scope.updateResource($scope.object({target:target, data:data}));
    }

    $scope.init = function() {
        if ($scope.__widgetReference) {
            //$scope.__widgetResource = $scope.__widgetReference;
            var widgetReferenceParts = $scope.__widgetReference.split('.');
            if (widgetReferenceParts.length == 2) {
                // TODO
                throw Error('todo')
                x = $parentScope[widgetReferenceParts[0]][widgetReferenceParts[1]]
            }else{
                if (!$parentScope['resource']) {
                    $parentScope['resource'] = {}
                }
                //if ($parentScope['resource'][widgetReferenceParts[0]]) {console.log('register watcher for parent.resource.REFERENCE',  widgetReferenceParts[0]);
                    $parentScope.$watch('resource.' + widgetReferenceParts[0], function() {
                        $scope.log.debug('parents resource.REFERENCE has changed',  widgetReferenceParts[0], $parentScope['resource'], $parentScope['resource'][widgetReferenceParts[0]]);
                        $scope.__widgetResourceList = $parentScope['resource'][widgetReferenceParts[0]];
                        $scope.updateResource();
                    });
                //} // TODO? this is still weird. And right now its overwritten in provider.load
                //$scope['resource'] = $parentScope['resource'][widgetReferenceParts[0]] = {};
                
                
            } // TODO: throw error if more than 2
            if ($parentScope['_resource']) {
                //$scope['_parent_resource'] = $parentScope['_resource'];
            }
        }
        if ($scope.__widgetResource) {
            //$scope.updateResource();
        }
    }
} // ', ['$scope', '$translate', '$translatePartialLoader', function


function get_linker_func(widgetConfig, $compile, $templateCache,   $anchorScroll,   $animate,   $sce, $injector, frontendCore){
    return function linker(scope, $element, $attr, ctrl, $transclude) {
        var changeCounter = 0,
            currentScope,
            previousElement,
            currentElement;
        var cleanupLastIncludeContent = function() {
          if(previousElement) {
            previousElement.remove();
            previousElement = null;
          }
          if(currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if(currentElement) {
            $animate.leave(currentElement, function() {
              previousElement = null;
            });
            previousElement = currentElement;
            currentElement = null;
          }
        };

        function widgetLoadErrorHandler() {
           return "<div>ERROR! {{ ERROR.WIDGET.LOAD | translate }}<a>{{ ERROR.RETRY | translate }}</a></div>"
        }
        function widgetInitErrorHandler() {
           return "<div>ERROR Init!{{ ERROR.WIDGET.INIT | translate }}<a>{{ ERROR.RETRY | translate }}</a></div>"
        }

        if (widgetConfig.widgetType === undefined) {
            console.warn('no widget defined')
            return
        }

        function fancyWidgetWatchAction(widgetIdentifier) {
          var src = widgetIdentifier.split(':')[0];
          var afterAnimation = function() {
            if (isDefined(widgetConfig.autoScrollExp) && (!widgetConfig.autoScrollExp || scope.$eval(widgetConfig.autoScrollExp))) {
              $anchorScroll();
            }
          };
          function prepareTemplate(response, js, keepScope, skipApply, error){
                currentElement = $element;
                if (!response && !js) {
                    response = widgetLoadErrorHandler();
                    scope.$emit('$includeContentError');
                }
    
                // init widget
                function proceed(content, currentScope) {
                      try {
                          if (js) {
                              //frontendCore.log_info('initializing widget', widgetConfig.widgetType);
                            frontendCore.addWidget(
                                                   currentElement,
                                                   widgetConfig.widgetTemplate!="false" ? content : null,
                                                   widgetConfig.widgetType,
                                                   js,
                                                   currentScope
                              );
                          }else{
                              $element.children().remove();
                              $element.append(content);
                          }
                          if (skipApply !== true) {
                              //currentScope.$apply();
                          }
                      }catch (e){
                          if (!error) {
                              //console.error(e, e.lineNumber || e.number, e.fileName, e.name, e.message);
                              console.error(e.stack);
                              // preventing endless error loop!
                              prepareTemplate(widgetInitErrorHandler(), undefined, undefined, undefined, true);
                          }else{
                              throw e
                          }
                      }
                  
                }
                
                // building new scope
                var newScope = keepScope ? scope : scope.$new(widgetConfig.plugin ? undefined : true)
                var jsConfig = config.forJS();
               
                currentScope = newScope;  
                prepareController($injector, currentScope, scope, jsConfig, widgetConfig, frontendCore)
                var prefetchData = true;
                var provider = null;
                //currentScope.__target = target;
                if (response) {
                    currentScope.apply(response, function(content){
                        proceed(content, currentScope);
                    })
                }else{
                    proceed(null, currentScope);
                }
                
    
                currentScope.$emit('$includeContentLoaded');
                scope.$eval(widgetConfig.onloadExp);
                
                      
                      
          }

          var cachedTemplate = $templateCache.get(widgetIdentifier);
          if (cachedTemplate) {
            prepareTemplate(cachedTemplate[0], cachedTemplate[1], undefined, true);
          }else
          if (src) {
            // TODO: require:plugin!src
            var namespace = widgetConfig.widgetNamespace, identifier = src;
            var parts = src.split('.');
            if (parts.length > 1){
                namespace = parts[0];
                identifier = parts[1];
            }
            var error = 0;
            var dependencies = [];
            if (widgetConfig.widgetJS!="false") {
                widgetConfig.required.push('fancyPlugin!widget:'+ (widgetConfig.widgetJS || (namespace?namespace+':':'') + identifier))
                dependencies.push('js');
            }
            /*if (widgetConfig.widgetTemplate!="false") {
                widgetDependencies.push('fancyPlugin!template:'+ (widgetConfig.widgetTemplate || ((namespace?namespace+':':'') + identifier)));
                dependencies.push('template');
            }
            if (widgetConfig.widgetCSS!="false" && false) {
                widgetDependencies.push('fancyPlugin!css:'+ (widgetConfig.widgetCSS || (namespace?namespace+':':'') + identifier))
                dependencies.push('css');
            }*/
            if (widgetConfig.required.length) {
              require(widgetConfig.required, function(){
                    var response = dependencies.indexOf('template')>=0 ? arguments[dependencies.indexOf('template')] : null,
                        js = dependencies.indexOf('js')>=0 ? arguments[dependencies.indexOf('js')] : $;
                    /*if (!js[namespace] && !namespace) {
                        namespace = frontendConfig.widgets.defaults_namespace
                    }
                    widgetConfig.widgetNamespace = namespace;*/
                    js = js[namespace] ?
                        js[namespace][widgetConfig.widgetName]
                        : null/* || js[frontendConfig.widgets.defaults_namespace] ?
                            js[frontendConfig.widgets.defaults_namespace][widgetConfig.widgetType]
                            : null*/;
                    if (!js) {
                        // TODO: get some fallback stuff
                        console.error('couldnt find js for widget', widgetConfig.widgetIdentifier)
                    }
                    prepareTemplate(response, js);
                }, function(e) {
                    error++;
                    console.error(e.stack);
                    if (error == 1) {
                        prepareTemplate();
                    }
                    /*prepareTemplate(widgetLoadErrorHandler());
                    cleanupLastIncludeContent();
                    scope.$emit('$includeContentError');*/
              });
            }else{
                prepareTemplate(null, $[frontendConfig.widgets.defaults_namespace], undefined, true); // keepScope, skipApply
            }

            scope.$emit('$includeContentRequested');
          } else {
            prepareTemplate();
          }
        }
        //scope.$watch($sce.parseAsResourceUrl('"'+widgetConfig.widgetIdentifier+'"'), fancyWidgetWatchAction);
        fancyWidgetWatchAction(widgetConfig.widgetIdentifier);
    };
 };

	angular.module('directives', ['services', 'pascalprecht.translate', 'config'])
		.directive('appVersion', ['version', function(version) {
			return function(scope, elm, attrs) {
				elm.text(version);
		};
	}]).directive('loadWidget', ['$compile', '$templateCache', '$anchorScroll', '$animate', '$sce', '$injector', 'frontendCore',
                                   function($compile, $templateCache,   $anchorScroll,   $animate,   $sce, $injector, frontendCore){
             return {
                restrict: 'ACE',
                priority: 400,
                //terminal: true,
                //transclude: 'element',
                //scope: {},
                controller: angular.noop,
                compile: function(element, attr) {
                    var widgetParts = attr['loadWidget'].split('#'),
                        widgetIdentifier = widgetParts[0],
                        widgetView = widgetParts.length==2 ? widgetParts[1] : null,
                        widgetReference = attr['widgetReference'],
                        widgetTemplate = attr['widgetTemplate'],
                        widgetJS = attr['widgetJs'],
                        widgetCSS = attr['widgetCss'],
                        widgetData = widgetIdentifier.split(':'),
                        widgetNameParts = widgetData[0].split('.'),
                        widgetType = widgetNameParts.length == 2 ? widgetNameParts[1] : widgetNameParts[0],
                        widgetNamespace = widgetNameParts.length == 2 ? widgetNameParts[0] : frontendConfig.widgets.namespace,
                        widgetResource = widgetData[1] ? widgetData[1] : null,
                        onloadExp = attr.onload || '',
                        autoScrollExp = attr.autoscroll,
                        widgetConfig = {
                            'widgetNamespace': widgetNamespace,
                            'widgetType': widgetType,
                            'widgetData': widgetData[1],
                            'widgetView': widgetView,
                            'widgetReference': widgetReference,
                            'widgetTemplate': widgetTemplate,
                            'widgetResource': widgetResource,
                            'widgetIdentifier': widgetIdentifier,
                            'widgetJS': widgetJS,
                            'widgetCSS': widgetCSS,
                            'onloadExp': onloadExp,
                            'autoScrollExp': autoScrollExp,
                            'plugin': false,
                            'required': []
                        };

                        element.removeAttr('load-widget')
                        // TODO: test if controller is available, otherwise ignore this widget

                    return get_linker_func(widgetConfig, $compile, $templateCache,   $anchorScroll,   $animate,   $sce, $injector, frontendCore);
                }
             }
    }]).directive('loadPlugin', ['$compile', '$templateCache', '$anchorScroll', '$animate', '$sce', '$injector', 'frontendCore',
                                   function($compile, $templateCache,   $anchorScroll,   $animate,   $sce, $injector, frontendCore){
             return {
                restrict: 'ACE',
                //require: '^loadWidget',
                priority: 200,
                terminal: true,
                //transclude: 'element',
                //scope:{},
                controller: angular.noop,
                compile: function(element, attr) {
                    var widgetParts = attr['loadPlugin'].split('#'),
                        widgetIdentifier = widgetParts[0],
                        widgetView = widgetParts.length==2 ? widgetParts[1] : null,
                        widgetReference = attr['pluginReference'],
                        widgetTemplate = attr['pluginTemplate'],
                        widgetJS = attr['pluginJs'],
                        widgetCSS = attr['pluginCss'],
                        widgetData = widgetIdentifier.split(':'),
                        widgetNameParts = widgetData[0].split('.'),
                        widgetType = widgetNameParts.length == 2 ? widgetNameParts[1] : widgetNameParts[0],
                        widgetNamespace = widgetNameParts.length == 2 ? widgetNameParts[0] : frontendConfig.widgets.namespace,
                        widgetResource = widgetData[1] ? widgetData[1] : null,
                        onloadExp = attr.onload || '',
                        autoScrollExp = attr.autoscroll,
                        widgetConfig = {
                            'widgetNamespace': widgetNamespace,
                            'widgetType': widgetType,
                            'widgetData': widgetData[1],
                            'widgetView': widgetView,
                            'widgetReference': widgetReference,
                            'widgetTemplate': widgetTemplate,
                            'widgetResource': widgetResource,
                            'widgetIdentifier': widgetIdentifier,
                            'widgetJS': widgetJS,
                            'widgetCSS': widgetCSS,
                            'onloadExp': onloadExp,
                            'autoScrollExp': autoScrollExp,
                            'plugin': true,
                            'required': []
                        };
                        // TODO: test if controller is available, otherwise ignore this widget
                        element.removeAttr('load-plugin')

                    return get_linker_func(widgetConfig, $compile, $templateCache,   $anchorScroll,   $animate,   $sce, $injector, frontendCore);
                }
             }
    }]);
});