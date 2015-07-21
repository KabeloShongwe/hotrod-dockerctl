(function() {
    'use strict';

    var module = angular.module('home', ['timepicker', 'filters', 'data']);

    var COMPONENT_ROOT = 'components/home';

    module.config(function($stateProvider) {
        $stateProvider
            .state('app.home', {
                url: "/home?timepick",
                views: {
                    'content': {
                        templateUrl: COMPONENT_ROOT + "/home.html",
                        controller: 'HomeCtrl'
                    }
                }
            });
    });

    module.controller('HomeCtrl',function($scope, $http, $timeout, messages, config, _, apiHelper) {

        var refreshNodesData;
        $scope.refreshNodesData = function(trigger) {
            refreshNodesData = _.debounce(trigger, 250);
        };

        var nodeFilter;
        $scope.nodeFilterChanged = function(filter) {
            nodeFilter = filter;
            refreshNodesData();
        };

        $scope.getNodeData = function(options) {
            options.nodeFilter = nodeFilter;
            return apiHelper.get('server/nodeinfo', options).then(function (response) {
                return response.data;
            });
        };
    });
}());
