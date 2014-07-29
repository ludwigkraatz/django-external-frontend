define(['fancyPlugin!fancyWidgetCore', 'fancyPlugin!fancyFrontendConfig'], function($, config){
    $(function() {

        var widgetConfig = $[config.widgets.namespace]._widgetConfig;

            $.widget( config.widgets.defaults_namespace + '.core',{
                    options: {
                    },

                    _create: function(){

                    },

                    apply: function(){
                        $scope.$apply()
                    }

            });
            $.widget( config.widgets.defaults_namespace + '.widget',{
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
})
