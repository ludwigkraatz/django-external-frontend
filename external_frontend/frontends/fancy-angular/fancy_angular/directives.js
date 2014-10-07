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
    var $ApiProvider = $injector.get('$ApiProvider'),
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
        error: function(){
            if (true) {
                var stack, content = Array.prototype.slice.call(arguments);
                for (var arg in content) {
                    if (content[arg] instanceof Error) {
                        content[arg] = {stack: content[arg].stack, type: content[arg].constructor.name};
                    }
                }
                if (!stack) {
                    stack =  new Error().stack;
                }
                $scope.__log_storage.push({type: 'error', timestamp:new Date().getTime(), content:content, stack:stack})
                $scope.log.failure('Error.') // TODO: get translated default error Message for user
            }else{
                console.error.apply(console, arguments)
            }
        },
        event: function(){
            if (true) {
                var stack = new Error().stack;
                $scope.__log_storage.push({type: 'event', timestamp:new Date().getTime(), content:Array.prototype.slice.call(arguments), stack:stack})
            }else{
                console.log.apply(console, arguments)
            }
        },
        debug: function(){
            if (true) {
                var stack = new Error().stack;
                $scope.__log_storage.push({type: 'debug', timestamp:new Date().getTime(), content:Array.prototype.slice.call(arguments), stack:stack})
            }else{
                console.log.apply(console, arguments)
            }
        },
        warn: function(){
            if (true) {
                var stack = new Error().stack;
                $scope.__log_storage.push({type: 'warn', timestamp:new Date().getTime(), content:Array.prototype.slice.call(arguments), stack:stack})
                $scope.log.failure('Warning.') // TODO: get translated default warning Message for user
            }else{
                console.log.apply(console, arguments)
            }
        },
        success: function(){ // is propagated to user
            if (true) {
                var stack = new Error().stack;
                $scope.__log_storage.push({type: 'success', timestamp:new Date().getTime(), content:Array.prototype.slice.call(arguments), stack:stack})
            }else{
                console.log.apply(console, arguments)
            }
        },
        failure: function(){ // is propagated to user
            if (true) {
                var stack = new Error().stack;
                $scope.__log_storage.push({type: 'failure', timestamp:new Date().getTime(), content:Array.prototype.slice.call(arguments), stack:stack})
            }else{
                console.log.apply(console, arguments)
            }
        },
        info: function(){ // is propagated to user
            if (true) {
                //console.log('-->',arguments.callee.caller.name,arguments.callee.caller.arguments.callee.caller.name)
                var stack = new Error().stack;
                $scope.__log_storage.push({type: 'info', timestamp:new Date().getTime(), content:Array.prototype.slice.call(arguments), stack:stack})
            }else{
                console.log.apply(console, arguments)
            }
        },
        warning: function(){ // is propagated to user
            if (true) {
                var stack = new Error().stack;
                $scope.__log_storage.push({type: 'warning', timestamp:new Date().getTime(), content:Array.prototype.slice.call(arguments), stack:stack})
            }else{
                console.log.apply(console, arguments)
            }
        }
    }
    $scope._accessApiEndpoint = function(){
        var apiObj = $ApiProvider.get.apply(null, arguments);
        apiObj.setLog($scope.log);
        $scope._initAttrBindings(apiObj);
        return apiObj
    }
    $scope._getApiPlaceholder = function(settings){
        if (!settings.hasOwnProperty('log')) {
            settings.log = $scope.log;
        }
        return $ApiProvider.blank(settings);
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
    
    $scope.__widgetName = widgetConfig.widgetName;
    $scope.__widgetNamespace = widgetConfig.widgetNamespace;
    $scope.generateWidgetName = function(){
        return $scope.__widgetNamespace + '.' + $scope.__widgetName + (
                    $scope.__widgetInstanceName ? ('<' + $scope.__widgetInstanceName + '>') : ''
                    );
    }
    $scope.__state = widgetConfig.widgetState;
    if ($parentScope.__state) {
        $scope.__state = $.extend({}, $parentScope.__state[$scope.generateWidgetName()], $scope.__state);
    }
    $scope.__defaultWidgetView = widgetConfig.widgetView;
    //$scope.__widgetData = widgetConfig.widgetResource ? (widgetConfig.widgetResource): null;
    
    $scope.__widgetIdentifier = widgetConfig.widgetIdentifier;
    $scope.generateWidgetState = function(){
        return (
                    $scope.__resourceId ? ':' + $scope.__resourceId : ''
                ) + (
                    $scope.__defaultWidgetView ? '#' + $scope.__defaultWidgetView : ''
                )
    }
    $scope.generateIdentifier = function(){
        /*return $scope.__widgetName + (
                    $scope.__defaultWidgetView ? '#' + $scope.__defaultWidgetView : ''
                );
        */
        return $scope.generateWidgetName() + $scope.generateWidgetState();
    };
    $scope.__type = widgetConfig.plugin ? 'plugin' : 'widget';

    if ($scope.__type == 'widget') {
        $scope.resource = {};
        $scope.resourceList = [];
        $scope.log.debug('init _resource scope', $scope)
        $scope._relationships = {};
        $scope._resource = $scope._getApiPlaceholder({
            initialContent: $scope.resource,
            target: 'uuid',
        })
        $scope._resourceList = $scope._getApiPlaceholder({
            initialContent: $scope.resourceList,
            target: 'relationship',
        });
    
        $scope.updateResource = function (resource) {
            $scope.log.debug('trying to update with', resource);
            if (resource && resource.__path && resource.__path.target) {
                if (resource.__path.target == 'relationship') {
                    if ($scope['_resourceList'] !== resource) {
                        $scope.log.debug(' updating resourceList', $scope['_resourceList'], 'with', resource)
                        var old = $scope['_resourceList'];                             
                        $scope['_resourceList'] = resource;
                        old.replaceWith(resource);
                    }
                }else{
                    if ($scope['_resource'] !== resource) {
                        $scope.log.debug(' updating resource', $scope['_resource'], 'with', resource)
                        var old = $scope['_resource'];
                        console.log(resource)
                        $scope['_resource'] = resource;
                        old.replaceWith(resource);
                    }
                }
                return resource
            }
            $scope.log.debug(' updating failed', resource, 'has no __path.target')
            return undefined
        }
        $scope._attrs = []
        $scope._initAttr = function (name, settings) {
            if (name == '!all') {
                var done = null;
                $scope.log.debug('refreshing scope attrs');
                for (var key in $scope._attrs){
                    try {
                        $scope._initAttr($scope._attrs[key], settings)
                    } catch(e) {
                        $scope.log.error('couldnt init attr', $scope._attrs[key], e)
                        done = false;
                    }
                    
                }
                return done === null ? true : done;
            }
            
            $scope.log.debug('init scope attr "' + name + '"');
            if ($scope._attrs.indexOf(name) == -1) {
                $scope._attrs.push(name);
            }
    
            // TODO - don't just take the first, get the primary (_resourceList.primary()?)
            if ($scope['__' + name + 'AsPrimary'] && $scope.resourceList && $scope.resourceList.length){
                //$scope.__defaultWidgetView == 'detail' && $scope.resourceList && $scope.resourceList.length) {
                $scope.log.debug('display list as the primary element')
                $scope['__'+ name +'Target'] = 'uuid';
                $scope['__'+ name +'Id'] = $scope[name +'List'][0].uuid ? $scope[name +'List'][0].uuid : $scope[name +'List'][0];
            }
    
            var data,
                target = $scope['__'+ name +'Target'];
            if (target == 'relationship'){
                data = $scope['__'+ name +'Reference']
            }else{
                target = target  || 'uuid';
                data = $scope['__'+ name +'Id'];
            }
            return $scope.updateResource($scope.object({target:target, data:data}));
        };
    
        $scope._prepareAttr = function(name, initialValue, asPrimary){
                
            if (!$scope['__' + name + 'Id'] && initialValue){
                $scope.log.debug('setting default for "' + name +'" to', initialValue)
                $scope['__' + name + 'Id'] = initialValue
            }
            if ($scope['__' + name + 'AsPrimary'] === undefined && asPrimary !== undefined) {
                $scope['__' + name + 'AsPrimary'] = asPrimary
            }
        };
        
        $scope.prepareResource = function() {
            $scope.log.debug('prepare scope resource');
            $scope.__resourceReference = widgetConfig.widgetReference;
            //$scope.__resourceId = null; //widgetConfig.widgetResource;
            //$scope.__resourceIdList = null;
        
            $scope.__resourceTarget = $scope.__resourceReference ? 'relationship' : 'uuid';
            
            if ($scope.__resourceReference) {
                //$scope.__resourceId = $scope.__resourceReference;
                var widgetReferenceParts = $scope.__resourceReference.split('.');
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
                            $scope.log.debug('parents resource.'+widgetReferenceParts[0]+' has changed', $parentScope['resource'], $parentScope['resource'][widgetReferenceParts[0]]);
                            $scope.__resourceIdList = $parentScope['resource'][widgetReferenceParts[0]];
                            $scope._initAttr('!all', {force_update: false});
                        });
                        $parentScope.$watch('_relationships.' + widgetReferenceParts[0], function() {
                            $scope.log.debug('parents _relationships.'+widgetReferenceParts[0]+' has changed', $parentScope['_relationships'], $parentScope['_relationships'][widgetReferenceParts[0]]);
                            $scope.updateResource($parentScope['_relationships'][widgetReferenceParts[0]]);
                        });
                    //} // TODO? this is still weird. And right now its overwritten in provider.load
                    //$scope['resource'] = $parentScope['resource'][widgetReferenceParts[0]] = {};
                    
                    
                } // TODO: throw error if more than 2
                if ($parentScope['_resource']) {
                    //$scope['_parent_resource'] = $parentScope['_resource'];
                }
            }
            if ($scope.__resourceId) {
                //$scope.updateResource();
            }
        }
        
    }else{
        $scope.log.debug('init plugin scope', $scope);
        
        $scope.updateResource = $scope._initAttr = $scope.prepareResource = function() {
            $scope.log.error('not available for plugins');
        }
    }

    for (var key in jsConfig) {
        $scope.log.debug('jsConfig: ', key, jsConfig[key])
        $scope[key] = jsConfig[key];
    }
    $scope.__fixtures = {};
    $scope.addLocale = function(name){
        return $fancyAngularLocalesLoader.addPart(name);
    };
    $scope.addFixture = function(name, content){
        $scope.log.debug('updating fixture "', name, '" with', content)
        $scope.__fixtures[name] = content;
        $scope._initAttr('!all', {force_update: false});
    };
    $scope.loadFixture = function(name){$scope.log.debug('loadig fixture', name)
        $scope.__fixtures[name] = undefined;
    };
    
    $scope._initAttrBindings = function(obj){
        if (!!!obj.__event_handler) {
            $scope.log.debug('skip init scope.attr bindings for', obj, 'because seems to be attribute')
            return
        }
        $scope.log.debug('init scope.attr bindings for', obj)
        obj.bind('post-*', function(event, apiResult){
            $scope.log.event.apply(null, arguments)
            if (apiResult.action != 'fixture') {
                $scope.apply();
            }
        })
        obj.bind('start-loading*', function(event, apiResult){
            $scope.log.event('start loading', event, apiResult)
            $scope['!private'].$widget.start_loading();
        })
        obj.bind('finished-loading*', function(event, apiResult){
            $scope.log.event('end loading', event, apiResult)
            $scope['!private'].$widget.finished_loading();
        })
        obj.bind('replaced', function(event, new_obj){
            $scope.log.event('replaced', obj, 'with', new_obj)
            $scope._initAttrBindings(new_obj);
        })
        obj.bind('accessed-related', function(event, new_obj){
            $scope.log.event('accessed', new_obj, 'from', obj)
            $scope._initAttrBindings(new_obj);
        })
    };
    $scope.$on('applied', function(event){
            $scope.log.event('$digest');// , event);
            event.stopPropagation();
    })
    
    $scope.object = function(settings){
        var provider, fixture;
        $scope.log.debug('getting object', settings, 'fixtures:', $scope.__fixtures);
        
        if (settings.target == 'relationship' && $scope.__resourceIdList) {
            $scope.log.debug('found relationship in parent');
            fixture = $scope.__resourceIdList;
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
            provider = $scope._accessApiEndpoint('object').get(settings) //@currentScope.__widgetName
        }
        $scope._initAttrBindings(provider);
        return fixture ? provider.fromFixture(fixture) : provider
    };
    $scope.init = function($widget){
        $scope['!private'] = {}
        $scope['!private'].$widget = $widget;
        if ($widget.object) {
            $scope.__as = $widget.object; // TODO: use for ApiResources
        }
        if ($scope.__state && $scope.__state['.']) {
            for (var key in $scope.__state['.']) {
                var value = $scope.__state['.'][key];
                if (key[0] == '_') {
                    if (key == '_name') {
                        $scope.__widgetInstanceName = value;
                    }
                    if (key == '_activeView') {
                        $scope.__defaultWidgetView = value;
                    }
                }else{console.log(key, value);
                    if (value.hasOwnProperty('asPrimary')) {
                        $scope['__'+ key + 'AsPrimary'] = value['asPrimary'];
                    }
                    if (value.hasOwnProperty('uuid') && value['uuid']) {
                        $scope['__'+ key + 'Id'] = value['uuid'];
                    }
                    if (value.hasOwnProperty('uuid_list') && value['uuid_list']) {
                        $scope['__'+ key + 'IdList'] = value['uuid_list'];
                    }
                }
            }
                
            
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
                                                   widgetConfig.widgetName,
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
            function parseState(stateString) {
                var stringScope = stateString[0] == '#' ? 'view' : 'state',
                    state = {'resource': {}},
                    root_state = {'.': state},
                    activeView = undefined,
                    parts;
                stateString = stateString.slice(1);

                if (stringScope == 'view') {
                    activeView = stateString.split(':')[0];
                    stateString = stateString.indexOf(':') != -1 ? stateString.split(':')[1] : '';
                }else if (stateString.indexOf('#') != -1) {
                    parts = stateString.split('#');
                    activeView = parts[1];
                    stateString = parts[0];
                }
                state['_activeView'] = activeView;
                
                if (stateString[0] == '!'){
                    stateString = window.atob(stateString.slice(1));
                }
                
                if (stateString[0] == '{'){
                    $.extend(stringScope == root_state, JSON.parse(stateString)); // TODO: un-urlify
                }else if (stateString[0] == '['){
                    state['resource']['uuid_list'] = JSON.parse(stateString); // TODO: un-urlify
                }else {
                    state['resource']['uuid'] = stateString;
                }
                return root_state;
            }
            function prepareWidgetConfig(widgetConfig){
                var parts = widgetConfig.widgetIdentifier.indexOf(':') != -1 ?
                                            widgetConfig.widgetIdentifier.split(':')
                                            : (widgetConfig.widgetIdentifier.indexOf('#') != -1 ?
                                                    widgetConfig.widgetIdentifier.split('#')
                                                    : [widgetConfig.widgetIdentifier]
                                                );
                widgetConfig.widgetXXX = parts[0];
                widgetConfig.widgetState = parts.length > 1 ?
                                                parseState(widgetConfig.widgetIdentifier.slice(
                                                                widgetConfig.widgetXXX.length,
                                                                widgetConfig.widgetIdentifier.length
                                                            )
                                                )
                                                : {'.': {'resource': {}}};

                
                parts = widgetConfig.widgetXXX.split('!');
                if (parts.length > 1 ) {
                    widgetConfig.widgetState['.'].resource.asPrimary = true;
                }
                parts = parts[0].split('<');
                if (parts.length > 1 ) {
                    widgetConfig.widgetState['.']._name = parts[1].slice(0, parts[1].length -1);
                }
                
                parts = parts[0].split('.');
                // TODO: NamespaceProvider.lookup(scope, widgetConfig);
                widgetConfig.widgetNamespace = parts.length > 1 ? parts[0] : frontendConfig.widgets.namespace;
                widgetConfig.widgetName = parts.length > 1 ? parts[1] : parts[0];
                widgetConfig.widgetSource = widgetConfig.widgetNamespace + ':' + widgetConfig.widgetName;
                widgetConfig.widgetData = widgetConfig.widgetResource = widgetConfig.widgetState ?
                    widgetConfig.widgetState['.']['uuid'] : null;
                widgetConfig.widgetView = widgetConfig.widgetState ?
                    widgetConfig.widgetState['.']['_activeView'] : null;
            }
            // TODO: require:plugin!src
            prepareWidgetConfig(widgetConfig);
            var namespace = widgetConfig.widgetNamespace,
                identifier = widgetConfig.widgetSource;
            var error = 0;
            var dependencies = [];
            if (widgetConfig.widgetJS!="false") {
                widgetConfig.required.push('fancyPlugin!widget:'+ widgetConfig.widgetSource)
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
                        widgetIdentifier = attr['loadWidget'], //widgetParts[0],
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