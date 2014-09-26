/**
 * this isn't a classic requirejs plugin.
 * its more the locale loader for angulars translate module
 *
 */
define(['fancyPlugin!angularTranslate'], function(){
    return angular.module("pascalprecht.translate").
        factory("$fancyAngularLocalesLoader",
                ["$q","$http",
                 function($q,$http){var a=$q, b=$http;
                    return function(c){
                        var d=a.defer();
                        var proceed = function (locale) {
                            d.resolve(locale);
                        };
                        require(['fancyPlugin!locale-' + c.key],
                            function requireSuccess(locale){
                                if (typeof locale == typeof 'string') {
                                    require(['json'], function(json){
                                        locale = json.parse(locale);
                                        proceed(locale);
                                    });
                                }else{
                                    proceed(locale);
                                }
                            },
                            function requireError(error){
                                d.reject(c.key)
                            }
                        )
                        return undefined,
                                d.promise
                    }
                }
                ]
            );
})