(function() {
    'use strict';

    var config =  angular.module('config');

    config.constant('hotrodComponentsBasePath', 'bower_components/hotrod-components/src');

    var module = angular.module('app', [
        'hotrod.charts',
        'ui.router',
        'messages',
        'config',
        'home',
        'filters',
        'wrappers',
        'auth',
        'dash.auth',
        'server',
        'timepicker',
        'status',
        'urlUtils'
    ]);

    module.controller('NavToggleCtrl', function($rootScope, $scope) {
        // Note: need separate 'isCollapsed' scope variable for navbar collapse to work in mobile mode
        // If we use the 'timepicker.show' value, it always gets set to false when clicking on the bootstrap-provided toggle button
        $scope.isCollapsed = true;

        $scope.toggleNavCollapse = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };
    });

    module.config(function($urlRouterProvider, $stateProvider, hotrodChartsConfigProvider, config, loginConfigProvider) {

        var testMode = location.href.indexOf('test_mode=true') !== -1;
        hotrodChartsConfigProvider.setTestMode(testMode);
        hotrodChartsConfigProvider.setImagesDir(config.webRoot + 'images');

        // If you want to use a custom login template, configure the path to it here:
        loginConfigProvider.setTemplateUrl('login.html');

        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    '': {
                        templateUrl: 'layout.html'
                    }
                },
                data: {
                    needsAuthentication: true
                }
            });

        // Note: this is needed to avoid circular routing issue with `$urlRouterProvider.otherwise('/home');`
        $stateProvider.state("otherwise", {
            url: "*path",
            controller: function($location) {
                console.log('Did not understand path ', $location.path(), ', redirecting to home');
                $location.path('/home');
            }
        });
    });

    module.run(function($rootScope, messages, authConfig, authData, config, urlBuilder) {
        $rootScope.appName = config.appName;
        $rootScope.currentStateName = null;

        $rootScope.$on('$stateChangeSuccess', function(event, toState){
            if (toState.name !== 'login') {
                messages.clearErrors();
            }
            $rootScope.currentStateName = toState.name;
            authConfig.expiredTokenMessage = 'Login expired. Please login again';
        });

        $rootScope.authData = authData.get();
        $rootScope.$on('hotrod.login', function() {
            $rootScope.authData = authData.get();
        });
        $rootScope.$on('hotrod.logout', function() {
            $rootScope.authData = {};
        });

        configureApiUrl(config, urlBuilder);
    });

    function configureApiUrl(config, urlBuilder) {
        var apiRootUrl = urlBuilder.build({
            protocol: config.apiProtocol,
            hostName: config.apiHostName,
            port: config.apiPort,
            path: config.apiPath
        });
        var apiVersion = config.apiVersion || 1;
        config.apiUrl = apiRootUrl + '/v' + apiVersion;
    }

    // Note: Need to set up an 'authUrl' value for injection into auth services from hotrod-components
    module.factory('authUrl', function(config, urlBuilder) {
        return urlBuilder.build({
            protocol: config.authProtocol,
            hostName: config.authHostName,
            port: config.authPort,
            path: config.authPath
        });
    });

    // Note: Need to set up an 'refreshTokenIntervalMins' value for injection into auth services from hotrod-components
    module.factory('refreshTokenIntervalMins', function(config) {
        return config.refreshTokenIntervalMins;
    });
}());