(function() {
    'use strict';

    var module = angular.module('data', ['config']);

    module.factory('apiHelper', function($http, config) {
        return {
            get: function(relativeUrlPath, options) {
                return $http.get(config.apiUrl + '/' + relativeUrlPath, {
                    params: options
                });
            }
        };
    });
}());
