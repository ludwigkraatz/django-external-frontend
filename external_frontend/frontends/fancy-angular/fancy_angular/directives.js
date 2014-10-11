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


function parseState(widgetIdentifier) {
    var nextElement,
        oldElement = null,
        state_string = widgetIdentifier,
        widget_source,
        currentElement,
        state = {'resource': {}},
        root_state = {'.': state},
        seperators = [  '{',  // followed by JSON state
                      // or as resource specific shortcuts
                        '<>',  // followed, and closed with >, by instance name nad resourceReference if '.' seperated name
                        ':',  // display the followed object (UUID or !)
                        '!',  // as selector, being applied on a list
                        '[]',  // indicating a list of resources, closed by ]
                        '#',  // active View
                        '?'   // activity widget instance / lookup
        ];
        
        

    function walkToNextSeperator(){
        var foundCurrent = false,
            found = false,
            withTerminator = false,
            walked_element = null;
        for (var index in seperators) {
            var value = seperators[index][0];
            if (!foundCurrent && nextElement && nextElement != value) {
                continue
            }
            if (foundCurrent === false) {
                foundCurrent = true;
                if (nextElement) {
                    value = seperators[index][1]
                    
                    if (!value) {
                        continue
                    }
                    withTerminator = true
                }
            }

            if (state_string.indexOf(value) != -1) {
                found = true;
                var seperator_index = state_string.indexOf(value);
                walked_element = state_string.slice(0, seperator_index);
                var old = state_string;
                state_string = state_string.slice(seperator_index + (withTerminator ? 1 : 0), state_string.length);
                break
            }
        }
        if (foundCurrent) {
            if (!found) {
                walked_element = state_string;
                state_string = '';
            }
            return walked_element
        }
        return null
    }

    function next() {
        if (state_string.length) {
            oldElement = nextElement;
            nextElement = state_string[0];
            state_string = state_string.slice(1);
            currentElement = walkToNextSeperator();
        }else{
            nextElement = null;
        }
        
    }
    
    // go to the first seperator
    widget_source = walkToNextSeperator();
    // check if its base64 encoded
    if (state_string[0] == '!') {
        state_string = window.atob(state_string.slice(1));
    }
    
    // activate first found element
    next()
    
    if (nextElement == '{' && currentElement) {
        root_state = JSON.parse(currentElement);

    }else if (nextElement){

        if (nextElement == '<') {
            if (currentElement.indexOf('.') != -1) {
                state.resource.reference = currentElement;
            }
            state._name = currentElement;

            next();
        }

        if (nextElement == ':') {
            var skipNextWalk = false;
            if (!currentElement) {
                next();
                if (nextElement == '!') {
                    if (currentElement) {
                        state['resource'].filter = currentElement;
                    }
                    state['resource'].asPrimary = true;
                }else if (nextElement == '['){
                    state['resource'].asNew = true;
                    state['resource']['uuid_list'] = JSON.parse(currentElement);
                }else{
                    skipNextWalk = true;
                }
            }else {
                state['resource']['uuid'] = currentElement;
            }
            if (!skipNextWalk)next();
        }

        if (nextElement == '#' && currentElement) {
            state['_activeView'] = currentElement;
            next();
        }

        if (nextElement == '?') {
            if (currentElement.length == 0) {
                state['_active'] = undefined;
            }else {
                // TODO: lookup in parents scope
                state['_active'] = null;
            }
            next();
        }
    }
    if (nextElement){
        throw Error('error parsing widget state')
    }

    return [widget_source, root_state];
}
function prepareWidgetConfig(widgetConfig){
    var parserResult = parseState(widgetConfig.widgetIdentifier);

    widget_source = parserResult[0];
    widgetConfig.widgetState = parserResult[1];
    
    parts = widget_source.split('.');
    // TODO: NamespaceProvider.lookup(scope, widgetConfig);
    widgetConfig.widgetNamespace = parts.length > 1 ? parts[0] : frontendConfig.widgets.namespace;
    widgetConfig.widgetName = parts.length > 1 ? parts[1] : parts[0];
    widgetConfig.widgetSource = widgetConfig.widgetNamespace + ':' + widgetConfig.widgetName;
    widgetConfig.widgetData = widgetConfig.widgetResource = widgetConfig.widgetState ?
        widgetConfig.widgetState['.']['resource']['uuid'] : null;
    widgetConfig.widgetView = widgetConfig.widgetState ?
        widgetConfig.widgetState['.']['_activeView'] : null;
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
    
    $scope.__widgetReference = widgetConfig.widgetReference;
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

    
    $scope.object = function(settings){
        var name = 'resource',
            config = settings.config || {};
        if (settings.hasOwnProperty('config'))delete settings.config;
        var provider, fixture;
        $scope.log.debug('getting object', settings, 'fixtures:', $scope.__fixtures);
        
        if (settings.target == 'relationship' && config.objList_json) {
            $scope.log.debug('found relationship in parent');
            fixture = config.objList_json;
        }
        if (!fixture) {
            for (var name in $scope.__fixtures){
                if ($scope.__fixtures[name] === undefined) {$scope.log.debug('fixture "', name, '" stil loading')
                    return undefined // wait until all fixtures are loaded
                }
                for (var key in $scope.__fixtures[name]){
                    var _fixture = $scope.__fixtures[name][key];
                    if (settings.target == 'relationship') {
                        if (_fixture.uuid == config.parentObj.__getID()/*$parentScope.__wdigetResource*/ && _fixture[settings.data]) {
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
            settings['initialContent'] = config.objList_json;
            if (!config.parentObj) {
                return undefined // wait until parent has loaded
            }
            $scope.log.debug('parentScope', settings)
            provider = config.parentObj.get(settings)
        }else{
            if (settings.data === undefined) {
                return undefined
            }
            settings['initialContent'] = config.obj_json;
            provider = $scope._accessApiEndpoint('object').get(settings) //@currentScope.__widgetName
        }
        $scope._initAttrBindings(provider);
        return fixture ? provider.fromFixture(fixture) : provider
    };
    
    if ($scope.__type == 'widget') {
        $scope.log.debug('init _resource scope', $scope)
    
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
                if ($scope._attrs.length) {
                    $scope.log.debug('refreshing scope attrs');
                }else{
                    $scope.log.debug('not refreshing scope attrs, none there');
                }
                
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
            if ($scope['__' + name + 'AsPrimary'] && $scope[name + 'List'] && $scope[name + 'List'].length){
                //$scope.__defaultWidgetView == 'detail' && $scope.resourceList && $scope.resourceList.length) {
                $scope.log.debug('display list as the primary element')
                $scope['__'+ name +'Target'] = 'uuid';
                $scope['__'+ name +'Id'] = $scope[name +'List'][0].uuid ? $scope[name +'List'][0].uuid : $scope[name +'List'][0];
            }
    
            var data,
                target = $scope['__'+ name +'Target'];
            if (target == 'relationship'){
                data = $scope['__'+ name +'Reference'].split('.').slice(-1)[0]
            }else{
                target = target  || 'uuid';
                data = $scope['__'+ name +'Id'];
            }
            var object_settings = {
                target:target,
                data:data,
                config: {
                    obj_json: $scope[name],
                    objList_json: $scope[name +'List'],
                    parentObj: $parentScope['_' + name]
                }
            };
            $scope.log.debug('(scope)', 'initializing ', name, 'with', object_settings)
            return $scope.updateResource($scope.object(object_settings));
        };
    
        $scope._prepareAttr = function(name, initialValue, attrReference, asPrimary){
                
            if (!$scope['__' + name + 'Id'] && initialValue){
                $scope.log.debug('setting default for "' + name +'" to', initialValue)
                $scope['__' + name + 'Id'] = initialValue
            }
            if ($scope['__' + name + 'AsPrimary'] === undefined && asPrimary !== undefined) {
                $scope['__' + name + 'AsPrimary'] = asPrimary
            }
            
            $scope._relationships = {};
            if (!$scope.hasOwnProperty(name)) {
                    $scope[name] = {}
            }
            if (!$scope.hasOwnProperty(name+'List')) {
                    $scope[name+'List'] = []
            }
            if (!$scope.hasOwnProperty('_'+name)) {
                    $scope['_'+name] = $scope._getApiPlaceholder({
                    initialContent: $scope[name],
                    target: 'uuid',
                })
            }
            if (!$scope.hasOwnProperty('_'+name+'List')) {
                    $scope['_'+name+'List'] = $scope._getApiPlaceholder({
                    initialContent: $scope[name+'List'],
                    target: 'relationship',
                })
            }
            
            if (!$scope.hasOwnProperty('__'+name+'Relationships')) {
                    $scope['__'+name+'Relationships'] = {}
            }
            if (!$scope.hasOwnProperty('__'+name+'Reference') && attrReference) {
                    $scope['__'+name+'Reference'] = attrReference;
            }
            $scope['__'+name+'Target'] = $scope['__'+name+'Reference'] ? 'relationship' : 'uuid';
            
            if ($scope['__'+name+'Reference']) {
                    
                var widgetReferenceParts = $scope['__'+name+'Reference'].split('.'),
                    attr_name = null,
                    attr_obj = null;

                if (widgetReferenceParts.length == 2) {
                    attr_obj = widgetReferenceParts[0];
                    attr_name = widgetReferenceParts[1];
                }else if (widgetReferenceParts.length == 1){
                    if (!$parentScope[name]) {
                        $parentScope[name] = {}
                    }
                    attr_obj = name
                    attr_name = widgetReferenceParts[0];
                }else{
                    var error = new Error()
                    $scope.log.error($scope['__'+name+'Reference'], 'is not a valid reference to parent', error)
                    throw error
                }

                $scope.log.debug('(scope)', 'watching', {
                    name: name,
                    attr_name: attr_name,
                    attr_obj:attr_obj,
                    reference: $scope['__'+name+'Reference']}, 'on parent')
                $parentScope.$watch( attr_obj +'.' + attr_name, function() {
                    $scope.log.debug('parents '+attr_obj+'.'+attr_name+' has changed', $parentScope[attr_obj], $parentScope[attr_obj][attr_name]);
                    $scope[name +'List'] = $parentScope[attr_obj][attr_name];
                    $scope._initAttr('!all', {force_update: false});
                });
                $parentScope.$watch('__'+attr_obj+'Relationships.' + attr_name, function() {
                    $scope.log.debug('parents __'+attr_obj+'Relationships.'+attr_name+' has changed', $parentScope['__'+attr_obj+'Relationships'], $parentScope['__'+attr_obj+'Relationships'][attr_name]);
                    $scope.updateResource($parentScope['__'+attr_obj+'Relationships'][attr_name]);
                });
            }
        };
        
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
    
    $scope._watchedObjects = [];
    $scope._initAttrBindings = function(obj){
        if (!!!obj.__event_handler) {
            $scope.log.debug('skip init scope.attr bindings for', obj, 'because seems to be attribute')
            return
        }
        if ($scope._watchedObjects.indexOf(obj) != -1) {
            $scope.log.debug('skip init scope.attr bindings for', obj, 'because seems to be bound already to this scope')
            return
        }
        $scope._watchedObjects.push(obj);
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
    
    $scope.init = function($widget){
        $scope['!private'] = {}
        $scope['!private'].$widget = $widget;
        // TODO: if debug
        $widget.element.on('inspect.fancy_angular.directive', function(event, callback){
            if (callback){
                callback('scope', $scope);
            }else{
                console.log('scope', $scope)
            }
        })
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
                }else{
                    if (value.hasOwnProperty('asPrimary')) {
                        $scope['__'+ key + 'AsPrimary'] = value['asPrimary'];
                    }
                    if (value.hasOwnProperty('uuid') && value['uuid']) {
                        $scope['__'+ key + 'Id'] = value['uuid'];
                    }
                    if (value.hasOwnProperty('uuid_list') && value['uuid_list']) {
                        $scope['__'+ key + 'IdList'] = value['uuid_list'];
                    }
                    if (value.hasOwnProperty('reference') && value['reference']) {
                        $scope['__'+ key + 'Reference'] = value['reference'];
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
          $element.addClass(frontendCore.config.frontend_generateClassName('state-initializing'));
          
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
        
        prepareWidgetConfig(widgetConfig);
        $element.addClass(frontendCore.config.frontend_generateClassName('instance'));
        $element.addClass(frontendCore.config.frontend_generateClassName('object-' + widgetConfig.widgetName))
        
        // TODO: if debug
        $element.bind('inspect.fancy_angular.directive', function(event, callback){
            if (callback){
                callback('element', $element);
            }else{
                console.log('element', $element)
            }
            //event.stopPropagation();
        })
        
        if (widgetConfig.widgetState && widgetConfig.widgetState.hasOwnProperty('.') && widgetConfig.widgetState['.'].hasOwnProperty('_active')) {
            if (widgetConfig.widgetState['.']._active === undefined) { 
                    $element.addClass(frontendCore.config.frontend_generateClassName('action'))
                if (widgetConfig.icon) {
                    $element.addClass(frontendCore.config.frontend_generateClassName('shape-icon'))
                }
                var startupHandler = function(){
                    $element.unbind('click', startupHandler);
                    $element.removeClass(frontendCore.config.frontend_generateClassName('action'));
                    fancyWidgetWatchAction(widgetConfig.widgetIdentifier, widgetConfig);
                }
                $element.bind('click', startupHandler)
                return
            }else if (widgetConfig.widgetState['.']._active === false) {
                //$element.remove()
                return
            }
        }
        fancyWidgetWatchAction(widgetConfig.widgetIdentifier, widgetConfig);
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
                            'required': [],
                            'icon': attr['actionIcon'],
                            'viewContainer': attr['viewContainer']
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
                            'required': [],
                            'icon': attr['actionIcon'],
                            'viewContainer': attr['viewContainer']
                        };
                        // TODO: test if controller is available, otherwise ignore this widget
                        element.removeAttr('load-plugin')

                    return get_linker_func(widgetConfig, $compile, $templateCache,   $anchorScroll,   $animate,   $sce, $injector, frontendCore);
                }
             }
    }]);
});