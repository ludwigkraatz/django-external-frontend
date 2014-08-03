define(['fancyPlugin!appConfig', 'fancyPlugin!angular', 'fancyPlugin!services', 'fancyPlugin!fancyWidgetCore', 'fancyPlugin!fancyFrontendConfig'], function(widgetCore, angular, services, $, frontendConfig) {
	'use strict';

  /* Directives */

function isDefined(args) {
    return args !== undefined
}


function get_linker_func(widgetConfig, $compile, $templateCache,   $anchorScroll,   $animate,   $sce, DataProvider, frontendCore){
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
           return "<div>ERROR!{{ ERROR.WIDGET.LOAD | translate }}<a>{{ ERROR.RETRY | translate }}</a></div>"
        }

        if (widgetConfig.widgetType === undefined) {
            console.warn('no widget defined')
            return
        }

        scope.$watch($sce.parseAsResourceUrl('"'+widgetConfig.widgetIdentifier+'"'), function fancyWidgetWatchAction(widgetIdentifier) {
          var src = widgetIdentifier.split(':')[0];
          var afterAnimation = function() {
            if (isDefined(widgetConfig.autoScrollExp) && (!widgetConfig.autoScrollExp || scope.$eval(widgetConfig.autoScrollExp))) {
              $anchorScroll();
            }
          };
          function prepareTemplate(response, js, keepScope, skipApply){
                if (!response && !js) {
                    response = widgetLoadErrorHandler();
                    scope.$emit('$includeContentError');
                }
    
                var newScope = keepScope ? scope : scope.$new();
                console.log('preparing', widgetConfig.widgetType, newScope);
                newScope.widgetType = widgetConfig.widgetType;
                newScope.defaultWidgetView = widgetConfig.widgetView;
                newScope.widgetData = widgetConfig.widgetResource ? parseInt(widgetConfig.widgetResource): null;
                newScope.widgetReference = widgetConfig.widgetReference;
    
                currentScope = newScope;
                currentElement = $element;
                if (currentScope.widgetReference) {
                    var widgetReferenceParts = currentScope.widgetReference.split('.');
                    if (widgetReferenceParts.length == 2) {
                        newScope.widgetData = scope[widgetReferenceParts[0]][widgetReferenceParts[1]]
                    }else{
                        newScope.widgetData = scope[widgetReferenceParts[0]]
                    } // TODO: throw error if more than 2
                }
                
                if (!(currentScope.widgetReference && !currentScope.widgetData)) {
                    DataProvider.get(currentScope.widgetType, currentScope.widgetData).then(function(content){
                        currentScope['_' + currentScope.widgetType] = content;
                        currentScope[currentScope.widgetType] = {};
                        for (var key in content){
                            currentScope[currentScope.widgetType][key] = content[key];
                        };
                        if (currentScope.widgetReference) {
                            if (widgetReferenceParts.length == 2) {
                                scope[widgetReferenceParts[0]][widgetReferenceParts[1]] = currentScope[currentScope.widgetType]
                            }else{
                                scope[widgetReferenceParts[0]] = currentScope[currentScope.widgetType]
                            }
                        }
                    });
                }
                
    
                currentScope.$emit('$includeContentLoaded');
                scope.$eval(widgetConfig.onloadExp);
                
                      var apply = function(rawContent, callback) {
                          var content = angular.element(rawContent);
                          var compiled = $compile(content);
                          compiled(currentScope);
                          if (callback){callback(content);}
                      }
                      
                      // init widget
                      function proceed(content) {
                        if (js) {
                            console.log('initializing widget', widgetConfig.widgetType);
                          frontendCore.addWidget(
                                                 currentElement,
                                                 widgetConfig.widgetTemplate!="false" ? content : null,
                                                 widgetConfig.widgetType,
                                                 apply,
                                                 js[widgetConfig.widgetType],
                                                 currentScope
                            );
                        }else{
                            $element.children().remove();
                            $element.append(content);
                        }
                        if (skipApply !== true) {
                            currentScope.$apply();
                        }
                        
                      }
                      
                      if (response) {
                            apply(response, function(content){
                                proceed(content);
                            })
                      }else{
                        proceed();
                    }
          }

          var cachedTemplate = $templateCache.get(widgetIdentifier);
          if (cachedTemplate) {
            prepareTemplate(cachedTemplate[0], cachedTemplate[1]);
          }else
          if (src) {
            // TODO: require:plugin!src
            var error = 0;
            var widgetDependencies = [];
            var dependencies = [];
            if (widgetConfig.widgetTemplate!="false") {
                widgetDependencies.push('fancyPlugin!template:'+ (widgetConfig.widgetTemplate || (src+':'+src)));
                dependencies.push('template');
            }
            if (widgetConfig.widgetJS!="false") {
                widgetDependencies.push('fancyPlugin!widget:'+ (widgetConfig.widgetJS || src)) // TODO: support externally defined app
                dependencies.push('js');
            }
            if (widgetConfig.widgetCSS!="false") {
                widgetDependencies.push('fancyPlugin!css:'+ (widgetConfig.widgetCSS || src)) // TODO: support externally defined app
                dependencies.push('css');
            }
            if (widgetDependencies.length) {
              require(widgetDependencies, function(){
                var response = dependencies.indexOf('template')>=0 ? arguments[dependencies.indexOf('template')] : null,
                    js = dependencies.indexOf('js')>=0 ? arguments[dependencies.indexOf('js')] : $;
                    js = js[widgetConfig.widgetJS=="false" ? frontendConfig.widgets.defaults_namespace : frontendConfig.widgets.namespace];
                    if (response && js) {
                        $templateCache.put(widgetIdentifier, [response, js])
                    }
                    prepareTemplate(response, js);
                }, function() {
                    error++;
                    if (error == 1) {
                        prepareTemplate();
                    }
                    /*prepareTemplate(widgetLoadErrorHandler());
                    cleanupLastIncludeContent();
                    scope.$emit('$includeContentError');*/
              });
            }else{
                prepareTemplate(null, $[frontendConfig.widgets.defaults_namespace], false, true); // keepScope, skipApply
            }

            scope.$emit('$includeContentRequested');
          } else {
            prepareTemplate();
          }
        });
    };
 };

	angular.module('directives', ['services', 'config'])
		.directive('appVersion', ['version', function(version) {
			return function(scope, elm, attrs) {
				elm.text(version);
		};
	}]).directive('loadWidget', ['$compile', '$templateCache', '$anchorScroll', '$animate', '$sce', 'DataProvider', 'frontendCore',
                                   function($compile, $templateCache,   $anchorScroll,   $animate,   $sce, DataProvider, frontendCore){
             return {
                restrict: 'ACE',
                priority: 400,
                //terminal: true,
                //transclude: 'element',
                scope: {},
                controller: angular.noop,
                compile: function(element, attr) {
                    var widgetParts = attr['loadWidget'].split('#'),
                        widgetIdentifier = widgetParts[0],
                        widgetView = widgetParts.length==2 ? widgetParts[1] : null,
                        widgetReference = null,
                        widgetTemplate = attr['widgetTemplate'],
                        widgetJS = attr['widgetJs'],
                        widgetCSS = attr['widgetCss'],
                        widgetData = widgetIdentifier.split(':'),
                        widgetResource = widgetData[1] ? widgetData[1] : null,
                        onloadExp = attr.onload || '',
                        autoScrollExp = attr.autoscroll,
                        widgetConfig = {
                            'widgetType': widgetData[0],
                            'widgetData': widgetData[1],
                            'widgetView': widgetView,
                            'widgetReference': widgetReference,
                            'widgetTemplate': widgetTemplate,
                            'widgetResource': widgetResource,
                            'widgetIdentifier': widgetIdentifier,
                            'widgetJS': widgetJS,
                            'widgetCSS': widgetCSS,
                            'onloadExp': onloadExp,
                            'autoScrollExp': autoScrollExp
                        };

                        element.removeAttr('load-widget')
                        // TODO: test if controller is available, otherwise ignore this widget

                    return get_linker_func(widgetConfig, $compile, $templateCache,   $anchorScroll,   $animate,   $sce, DataProvider, frontendCore);
                }
             }
    }]).directive('loadPlugin', ['$compile', '$templateCache', '$anchorScroll', '$animate', '$sce', 'DataProvider', 'frontendCore',
                                   function($compile, $templateCache,   $anchorScroll,   $animate,   $sce, DataProvider, frontendCore){
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
                        widgetResource = widgetData[1] ? widgetData[1] : null,
                        onloadExp = attr.onload || '',
                        autoScrollExp = attr.autoscroll,
                        widgetConfig = {
                            'widgetType': widgetData[0],
                            'widgetData': widgetData[1],
                            'widgetView': widgetView,
                            'widgetReference': widgetReference,
                            'widgetTemplate': widgetTemplate,
                            'widgetResource': widgetResource,
                            'widgetIdentifier': widgetIdentifier,
                            'widgetJS': widgetJS,
                            'widgetCSS': widgetCSS,
                            'onloadExp': onloadExp,
                            'autoScrollExp': autoScrollExp
                        };

                        // TODO: test if controller is available, otherwise ignore this widget
                        element.removeAttr('load-plugin')

                    return get_linker_func(widgetConfig, $compile, $templateCache,   $anchorScroll,   $animate,   $sce, DataProvider, frontendCore);
                }
             }
    }]);
});