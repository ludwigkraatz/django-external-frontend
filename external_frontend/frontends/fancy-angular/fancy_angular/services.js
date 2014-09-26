define(['fancyPlugin!angular'], function (angular) {
	'use strict';

  /* Services */

  // Demonstrate how to register services
  // In this case it is a simple value service.
	return angular.module('services', ['config'])
		.value('version', '0.1')
        .provider('$ObjectProvider', ['frontendCore', function(frontendCore) {
    // In the provider function, you cannot inject any
    // service or factory. This can only be done at the
    // "$get" method.

    this.stage = 'productive';

    this.$get = function($q) {
        var stage = this.stage;
        return {
            get: function(settings) {
                var type = settings.target,
                    selector = settings.data;
                if (stage == 'fixtures') {
                    var src = type;
                    var deferred = $q.defer();
                    require(['fancyPlugin!fixture:'+ src +':'+ src], function(result){
                        var data = null;
                        if (typeof selector == "number") {
                          for (var i=0;i<result.length;i++) {
                              if (result[i].id == selector) {
                                  data = result[i];
                                  break;
                              }
                          }
                        }else if (selector.length != undefined){
                          data = result;/*
                          for (var i=0;i<result.length;i++) {
                              if (selector.indexOf(result[i]) < 0) {
                                  data.slice(data.indexOf(result[i]));
                              }
                          }
                          console.log('l',data);*/ // TODO: filter
                        }else{
                            data = result;
                        }
                        deferred.resolve(data);
                      }, function() {
                        deferred.reject();
                    });
                    return deferred.promise
                }else{// frontendCore.endpoint
                    return frontendCore.endpoint.ajax.access('object').get(settings)
                }
            },
            fromFixture: function(content){
                // directives.js, line 84,
                // maybe even give fixtures down to api object
            }
        }
    };

    this.setStage = function(stage) {
        this.stage = stage;
    };
}]);
});
