define(['fancyPlugin!appConfig', 'fancyPlugin!angular', 'fancyPlugin!services'], function(widgetCore, angular, services) {
	'use strict';

  /* Directives */

function isDefined(args) {
    return args !== undefined
}

	angular.module('directives', ['services', 'config'])
		.directive('appVersion', ['version', function(version) {
			return function(scope, elm, attrs) {
				elm.text(version);
		};
	}]).directive('loadWidget', ['$compile', '$templateCache', '$anchorScroll', '$animate', '$sce',
                                   function($compile, $templateCache,   $anchorScroll,   $animate,   $sce){
             var get_linker_func = function(widgetConfig){
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
                       return "<div>{{ ERROR.WIDGET.LOAD | translate }}<a>{{ ERROR.RETRY | translate }}</a></div>"
                    }

                    if (widgetConfig.widgetTemplate === undefined) {
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
                      var thisChangeId = ++changeCounter;

                      var prepareTemplate = function(response){

                          if (thisChangeId !== changeCounter) return;
                          var newScope = scope.$new();
                          ctrl.template = response;//$sce.trustAsHtml(response);
                          //ctrl.templateUrl = widgetConfig.widgetIdentifier;

                          // Note: This will also link all children of ng-include that were contained in the original
                          // html. If that content contains controllers, ... they could pollute/change the scope.
                          // However, using ng-include on an element with additional content does not make sense...
                          // Note: We can't remove them in the cloneAttchFn of $transclude as that
                          // function is called before linking the content, which would apply child
                          // directives to non existing elements.
                          var clone = $transclude(newScope, function(clone) {
                            cleanupLastIncludeContent();
                            $animate.enter(clone, null, $element, afterAnimation);
                          });

                          currentScope = newScope;
                          currentElement = clone;

                            /*var content = angular.element(response);
                            var compiled = $compile(content.contents());
                            clone.replaceWith(content);
                            compiled(newScope);
                            newScope.$apply();//$digest();*/

                          currentScope.$emit('$includeContentLoaded');
                          scope.$eval(widgetConfig.onloadExp);
                      }

                      var cachedTemplate = $templateCache.get(widgetIdentifier);
                      if (cachedTemplate) {
                        prepareTemplate(cachedTemplate);
                      }else
                      if (src) {
                        // TODO: require:plugin!src
                          require(['fancyPlugin!template:'+ src +':'+ src, 'fancyPlugin!css:' + src, 'fancyPlugin!widget:' + src], function(response){
                              $templateCache.put(widgetIdentifier, response)
                              prepareTemplate(response);
                            }, function() {
                              if (thisChangeId === changeCounter) {
                                prepareTemplate(widgetLoadErrorHandler());
                                cleanupLastIncludeContent();
                                scope.$emit('$includeContentError');
                              }
                          });

                        scope.$emit('$includeContentRequested');
                      } else {
                        ctrl.template = null;
                        ctrl.templateUrl = null;
                        prepareTemplate(widgetLoadErrorHandler());
                        cleanupLastIncludeContent();
                      }
                    });
                };
             };
             return {
                restrict: 'ACE',
                priority: 400,
                terminal: true,
                transclude: 'element',
                controller: angular.noop,
                compile: function(element, attr) {
                    var widgetIdentifier = attr['loadWidget'],
                        widgetData = widgetIdentifier.split(':'),
                        onloadExp = attr.onload || '',
                        autoScrollExp = attr.autoscroll,
                        widgetConfig = {
                            'widgetTemplate': widgetData[0],
                            'widgetResource': widgetData[1],
                            'widgetIdentifier': widgetIdentifier,
                            'onloadExp': onloadExp,
                            'autoScrollExp': autoScrollExp
                        };

                        // TODO: test if controller is available, otherwise ignore this widget

                    return get_linker_func(widgetConfig);
                }
             }
    }]).directive('loadWidget', ['$compile', '$route', 'frontendCore', function($compile, $route, frontendCore) {
			return {
                link: function(scope, elm, attrs, ctrl) {
                    var apply = function(rawContent, callback) {
                        var content = angular.element(rawContent);
                        var compiled = $compile(content);
                        compiled(scope);
                        if (callback){callback(content);}

                        // apply angular
                        scope.$apply();
                    }
                    if (ctrl.template) {
                        apply(ctrl.template, function(content){
                            elm.children().remove();
                            elm.append(content);
                        })
                    }


                    // init widget
                    frontendCore.addWidget(elm, elm.attr('load-widget'), apply);
                },
                restrict: 'ACE',
                priority: -400,
                require: 'loadWidget',
            }
	}]);
});