define([
        'fancyPlugin!appConfig',
        'fancyPlugin!angular',
        'fancyPlugin!services',
        'fancyPlugin!fancyWidgetCore',
        'fancyPlugin!fancyFrontendConfig',
        'fancyPlugin!fancyScopeCore',
        'fancyPlugin!angularTranslateService'
    ], function(widgetCore, angular, services, $, frontendConfig, scopeCore) {
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
    // the source is formatted like this: widgetNamespace:widgetFileName
    // if the widgetName containts '__' this means, its in the file  the string before '__' defines. this is like a "local/private" subwidget
    widgetConfig.widgetSource = widgetConfig.widgetNamespace + ':' + (widgetConfig.widgetName.split('__')[0]);
    widgetConfig.widgetData = widgetConfig.widgetResource = widgetConfig.widgetState ?
        widgetConfig.widgetState['.']['resource']['uuid'] : null;
    widgetConfig.widgetView = widgetConfig.widgetState ?
        widgetConfig.widgetState['.']['_activeView'] : null;
}


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
                scopeCore.prepareScope($injector, currentScope, scope, jsConfig, widgetConfig, frontendCore)
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