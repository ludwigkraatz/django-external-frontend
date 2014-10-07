define(['fancyPlugin!app:fancy-frontend:widgets', 'fancyPlugin!fancyFrontendConfig', 'fancyPlugin!services'], function($, config, services){
    $(function() {

            $.widget( config.apps['fancy-angular'].namespace + '.core', $[config.apps['fancy-frontend'].namespace].core, {
                    options: {
                    },

                    _create: function(){
                        var $element = this.element;
                        var $this = this;
                        this._superApply( arguments );
/*
                        $this.scope = this.options.scope;
                        if (!this.scope.widgetView) {
                            this.scope.widgetView = this.scope.defaultWidgetView;
                        }
                        
                        if (this.scope.widgetView == 'list') {
                            var $content = $('<div></div>');
                            $content.attr('load-plugin', 'list');
                            $content.attr('plugin-template', 'false');
                            $content.attr('plugin-js', 'false');
                            $content.attr('plugin-css', 'false');
                            $content.attr('plugin-reference', this.scope.widgetType);
                            this.element.children().wrapAll($content);
                            this.apply($content);
                            //$content.attr('plugin-reference', 'list');
                            //this.element.children().remove();
                            //console.log($content);
                        }else{
                            $this.init_plugins();
                            // TODO: trigger event init_done
                        }
                        
                        */

                        
                    },
                    
                    get_widgetData: function(){
                        return this.scope['_' + this.scope.widgetType]
                    },

                    init_plugins: function(){
                        var $element = this.element;
                        var data = this.get_widgetData(),
                            attributeName = config.widgets.prefix + '-plugin';
                        var $this = this;
                        //console.log('init plugins with data ', data, 'and scope:', this.scope);

                        $element.find('[' + attributeName + ']:not([' + attributeName + '] [' + attributeName + '])').each(function(index, element){
                            var $plugin = $(element);
                            var pluginType = $plugin.attr(attributeName);
                            var pluginRef = null;
                            //console.log('found plugin ', pluginType);

                            if ($plugin.attr('plugin-reference')) {
                                pluginRef = $plugin.attr('plugin-reference').split('.');
                                pluginRef = pluginRef.length > 1 ? pluginRef[1] : pluginRef[0];
                            };
                            if (pluginRef) {
                                if (pluginRef && data === undefined) {
                                    var watchExpr = $this.scope.widgetType;
                                    var unregister = $this.scope.$watch('_'+watchExpr, function(newValue, oldValue){
                                        if (newValue === oldValue) {
                                            return
                                        }
                                        if (newValue && newValue[pluginRef] === undefined) {  // its being handled by other watch method
                                            $plugin.attr('load-plugin', pluginType);
                                            //console.log('load-plugin', $plugin.attr('load-plugin'), '(empty)');
                                            $this.apply($plugin);
                                        }
                                        unregister();
                                    });
                                }
                                var watchExpr = $this.scope.widgetType+'.'+pluginRef;
                                $this.scope.$watch('_'+watchExpr, function(newValue, oldValue){
                                    if (newValue === oldValue) {
                                        return
                                    }
                                    var widgetIdentifier = pluginType;
                                    var state = '(none)';
                                    /*if (newValue) {
                                        widgetIdentifier += ':'+newValue
                                        state = '(instance)';
                                    }*/
                                    $plugin.attr('load-plugin', widgetIdentifier);
                                    //console.log('load-plugin', $plugin.attr('load-plugin'), state);
                                    $this.apply($plugin);
    
                                });
                            }else{
                                $plugin.attr('load-plugin', pluginType);
                                //console.log('load-plugin', $plugin.attr('load-plugin'), '(standalone)');
                                $this.apply($plugin);
                            }
                            
                        })
                    }

            });
            $.widget( config.apps['fancy-angular'].namespace + '.widget',{
                    options: {
                    },

                    _create: function(){
                        this.element.draggable({ snap: true });
                    },

                    apply: function(){
                        $scope.$apply()
                    }

            });
            

    })
            return $;
})
