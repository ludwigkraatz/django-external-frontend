define(['fancyPlugin!angular', 'fancyPlugin!fancyWidgetCore'], function (angular, $) {
    
    function prepareScope($injector, $scope, $parentScope, jsConfig, widgetConfig, frontendCore){
        var $ApiProvider = $injector.get('$ApiProvider'),
            $fancyAngularLocalesLoader = $injector.get('$fancyAngularLocalesLoader'),
            $translate = $injector.get('$translate'),
            $compile = $injector.get('$compile'),
            $q = $injector.get('$q');
        
        $scope.this = $scope.$id;
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
                attr_obj = 'resource',
                config = settings.config || {},
                asNew = false;
            delete settings.config;
            var provider, fixture;
            $scope.log.debug('getting object', settings, 'fixtures:', $scope.__fixtures);
            
            if ((settings.target == 'uuid' && settings.data === null) || $scope['__' + attr_obj + 'AsNew']) {
                asNew = true;
            }
            
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
            
            if (settings.target == 'relationship' && settings.data !== null) {
                settings['initialContent'] = config.objList_json;
                if (!config.parentObj) {
                    return undefined // wait until parent has loaded
                }
                $scope.log.debug('parentScope', settings);
                provider = config.parentObj;
            }else{
                if (settings.data === undefined) {
                    return undefined
                }
                settings['initialContent'] = config.obj_json;
                if ($scope.__endpoint) {
                    var endpoints = $scope.__endpoint.split('/').reverse();
                    initialEndpoint = endpoints.pop();
                    if (!initialEndpoint) {
                        initialEndpoint = endpoints.pop()
                    }
                    if (initialEndpoint == 'data') {
                        settings.target = 'id'; // currently the data endpoints use the id attribute
                    }
                    /* TODO: ? if (endpoints.length == 1) {
                        settings.target = 'relationship' // this way the root endpoints are treatable as lists
                    }*/
                    
                    provider = $scope._accessApiEndpoint(initialEndpoint);
                    var endpoint;
                        //new_provider;
                    while (endpoints.length && (endpoint = endpoints.pop())) {
                        if (!endpoint) continue;
                        //new_provider = provider;
                        provider = provider.get(endpoint);
                    }
                    //if (asNew) {
                    //    provider = new_provider;
                    //}
                }else{
                    provider = $scope._accessApiEndpoint('object')
                };
            }
            if (settings.data === null) {
                result = provider;
            }else{
                if (asNew) {  // @currentScope.__asObject
                    if (!$scope['__' + attr_obj + 'AsNew']) {
                        $scope['__' + attr_obj + 'AsNew'] = true;
                    }
                    result = provider.new(settings)
                    $scope.log.debug('(scope)', 'created new', result)
                }else{
                    result = provider.get(settings) 
                }
            }
            
            $scope._initAttrBindings(result);
            return fixture ? result.fromFixture(fixture) : result
        };
        
        if ($scope.__type == 'widget') {
            $scope.log.debug('init _resource scope', $scope)
        
            $scope.updateResource = function (resource) {
                if (resource === undefined) {
                    $scope.log.debug('(FancyAngular)', '(Directives)', '(Scope)', 'skipping updating with', resource);
                    return resource
                }
                $scope.log.debug('trying to update with', resource);
                var attr_obj = 'resource',
                    obj = resource;
                if (!(resource && resource.__path && resource.__path.target)) {
                        var old = $scope['_resource'];
                    if (old && old.__path && old.__path.target && !old.isBlank() && !old.isCreated()) {
                        $scope.log.debug('skip updating', old, 'with new', config);
                        return old
                    }
                    var config = $scope._getAttrValueConfig('resource');
                    $scope.log.debug('no resource exitent, yet. offer new', config);
                        
                    var old_resource = resource;
                    resource = $scope.object(config)
                    if (!(resource && resource.__path && resource.__path.target)) {
                        return undefined
                    }
                    if (old_resource && old_resource.replaceWith) {
                        $scope.log.debug('no resource exitent, yet. offer new');
                        old_resource.replaceWith(resource);
                    }
                }
                
                if (resource.__path.target == 'relationship') {
                    if ($scope['_resourceList'] !== resource) {
                        $scope.log.debug(' updating resourceList', $scope['_resourceList'], 'with', resource)
                        var old = $scope['_resourceList'];                             
                        $scope['_resourceList'] = resource;
                        old.replaceWith(resource);
                        if ($scope['__' + attr_obj + 'AsPrimary']) {
                            $scope._initAttr(attr_obj, {force_update: false});
                        }else{
                            $scope[attr_obj] = $parentScope[attr_obj]
                        }
                    }
                }else{
                    if ($scope['_resource'] !== resource) {
                        $scope.log.debug(' updating resource', $scope['_resource'], 'with', resource)
                        var old = $scope['_resource'];
                        $scope['_resource'] = resource;
                        old.replaceWith(resource);
                        if ($scope['__'+attr_obj+'Relationships']) { // TODO: extend resource.__objects with old relationships
                            $scope['__'+attr_obj+'Relationships'] = resource.__objects;//$scope._getApiPlaceholder({'target': 'relationship', 'data': attr_name})
                        }
                        
                        if ($scope['__'+attr_obj+'Reference'] && !resource.isCreated()) {
                            var widgetReference = $scope._parseReference($scope['__'+attr_obj+'Reference']),
                                ref_attr_name = widgetReference.name,
                                ref_attr_obj = widgetReference.obj;
                            /*
                            resource.bind('post-create', function(event, result){
                                $scope.log.debug('(FancyAngular)', '(Directives)', '(Scope)', '(create)', 'adding', obj, 'to parents', (ref_attr_obj + '.' +ref_attr_name), 'relationship')
                                if ($parentScope['__'+ref_attr_obj+'Relationships'][ref_attr_name] === undefined ) {
                                    $parentScope['_'+ref_attr_obj].get({
                                        target: 'relationship',
                                        data: ref_attr_name,
                                        initialContent: $parentScope[ref_attr_obj][ref_attr_name],
                                        });
                                }
                                $parentScope['__'+ref_attr_obj+'Relationships'][ref_attr_name].add(result.obj); // TODO: adding result.obj or obj
                                $parentScope.$apply();
                            })  */
                            $scope.log.debug('(FancyAngular)', '(Directives)', '(Scope)', '(create)', 'adding', obj, 'to parents', (ref_attr_obj + '.' +ref_attr_name), 'relationship')
                                if ($parentScope['__'+ref_attr_obj+'Relationships'][ref_attr_name] === undefined ) {
                                    $parentScope['_'+ref_attr_obj].get({
                                        target: 'relationship',
                                        data: ref_attr_name,
                                        initialContent: $parentScope[ref_attr_obj][ref_attr_name],
                                        });
                                }
                            $parentScope['__'+ref_attr_obj+'Relationships'][ref_attr_name].add(obj);
                            $parentScope.$apply();
                        }
                    }
                }
                
                return resource
            }
            
            $scope._getAttrValueConfig = function (name){
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
                return object_settings
            };
            
            
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
                };
                if (settings === undefined) {
                    settings = {};
                }
                
                $scope.log.debug('init scope attr "' + name + '"');
                if ($scope._attrs.indexOf(name) == -1) {
                    $scope._attrs.push(name);
                }
        
                // TODO - don't just take the first, get the primary (_resourceList.primary()?)
                if ($scope['__' + name + 'AsPrimary']){
                    //$scope.__defaultWidgetView == 'detail' && $scope.resourceList && $scope.resourceList.length) {
                    $scope.log.debug('display list as the primary element', ($scope['__' + name + 'AsNew'] ? 'and as new' : ''), 'of list', $scope[name + 'List'])
                    $scope['__'+ name +'Target'] = 'uuid';
                    if ($scope['__' + name + 'AsNew'] || (!$scope[name + 'List'] || $scope[name +'List'].length == 0)) {
                        $scope['__'+ name +'Id'] = null;
                        //$scope['__' + name + 'AsNew'] = true;
                    }else{
                        $scope['__'+ name +'Id'] = $scope[name +'List'][0].uuid ? $scope[name +'List'][0].uuid : $scope[name +'List'][0];
                    }
                }
                var obj = $scope.object($scope._getAttrValueConfig(name), settings)
                if (settings.force_update === false && (!obj || ($scope['_'+ name ] && !$scope['_'+ name ].isBlank() && (obj.isBlank() || (!obj.isCreated() && !$scope['_'+ name ].isCreated()))))) {
                    $scope.log.debug('skip updating', $scope['_'+ name ], 'with', obj, 'because its just a weak update')
                    return $scope['_'+ name ]
                }
                return $scope.updateResource(obj);
            };
            
            $scope._parseReference = function(str){
                var widgetReferenceParts = str.split('.');
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
                    $scope.log.error(str, 'is not a valid reference to parent', error)
                    throw error
                }
                return {
                    name: attr_name,
                    obj: attr_obj
                }
            };
        
            $scope._prepareAttr = function(name, initialValue, attrReference, asPrimary){
                    
                if (!$scope[name + 'Save']){
                    $scope[name + 'Save'] = function(){
                        if ($scope['_' + name].needsSave())$scope['_' + name].save()
                    }
                };
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
                        
                    var widgetReference = $scope._parseReference($scope['__'+name+'Reference']),
                        attr_name = widgetReference.name,
                        attr_obj = widgetReference.obj;
    
                    $scope.log.debug('(scope)', 'watching', {
                        name: name,
                        attr_name: attr_name,
                        attr_obj:attr_obj,
                        reference: $scope['__'+name+'Reference']}, 'on parent')
                    
                    if ($scope[name +'List']) {
                        $scope[name +'List'] = $parentScope[attr_obj][attr_name];
                    }
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
            obj.bind('accessed-clone', function(event, new_obj){
                $scope.log.event('accessed new', new_obj, 'from', obj)
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
            if ($widget && $widget.endpoint) {
                $scope.__endpoint = $widget.endpoint;
            }
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
                        if ($parentScope[key]) {
                            $scope[key + 'Parent'] = $parentScope[key];
                        }
                        
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
                        if (value.hasOwnProperty('asNew') && value['asNew']) {
                            $scope['__'+ key + 'AsNew'] = True;
                        }
                        if (value.hasOwnProperty('filter') && value['filter']) {
                            $scope['__'+ key + 'Filter'] = value['filter'];
                        }
                    }
                }
                    
            }
        }
    } // ', ['$scope', '$translate', '$translatePartialLoader', function
    
    return {
        prepareScope: prepareScope
    }
});