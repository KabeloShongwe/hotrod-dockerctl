(function() {
    'use strict';

    var module = angular.module('server', ['hotrod.charts', 'data', 'ui.router', 'ngSanitize', 'ui.select']);

    var COMPONENT_ROOT = 'components/server';

    module.config(function($stateProvider) {
        $stateProvider
            .state('app.server-dash', {
                url: "/server/:nodeName/:section?timepick",
                views: {
                    'sidebar': {
                        templateUrl: COMPONENT_ROOT + "/sidebar.html",
                        controller: 'ServerSidebarCtrl'
                    },
                    'content': {
                        templateUrl: function ($stateParams){
                            return COMPONENT_ROOT + "/" + $stateParams.section + ".html";
                        },
                        controller: 'ServerCtrl'
                    }
                }
            });
    });

    module.controller('ServerCtrl',function($scope, $state) {
        $scope.nodeName = $state.params.nodeName;
    });

    module.controller('ServerSidebarCtrl',function($scope, $state) {
        $scope.nodeName = $state.params.nodeName;
        $scope.sectionFromState = $state.params.section;

        $scope.$on('$stateChangeSuccess', function(e, toState, toStateParams) {
            $scope.sectionFromState = toStateParams.section;
        });

        $scope.sectionsLookup = {
            server: 'Server'
        };
        $scope.sections = Object.keys($scope.sectionsLookup);
    });
}());
