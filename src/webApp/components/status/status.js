(function() {
    'use strict';
    var module = angular.module('status', []);

    var COMPONENT_ROOT = 'components/status';

    module.factory('statusChecker', function($rootScope, $interval, $http, config) {
        var running = false;
        return {
            run: function(callback) {
                if (running) {
                    console.log('Status checker already running');
                    return;
                }
                running = true;

                var unknownStatus = {
                    message: "Unknown",
                    status: false
                };

                var lastStatus;
                function updateStatus(latestStatus) {
                    if (lastStatus && latestStatus.status === lastStatus.status) {
                        return;
                    }
                    callback(latestStatus);
                    lastStatus = latestStatus;
                    $rootScope.$broadcast('es.status.changed', latestStatus);
                }
                updateStatus(unknownStatus);

                function checkStatus() {
                    return $http.get(config.apiUrl + '/status').success(updateStatus).error(function() {
                        updateStatus(unknownStatus);
                    });
                }

                var interval;
                checkStatus().finally(function() {
                    if (!running) {
                        return;
                    }
                    interval = $interval(function() {
                        checkStatus();
                    }, config.esStatusCheckDelay);
                });

                return function stop() {
                    running = false;
                    $interval.cancel(interval);
                };
            }
        };
    });

    module.controller('StatusCtrl', function($scope, $modal, statusChecker) {
        var stopFn = statusChecker.run(function(updatedStatus) {
            $scope.status = updatedStatus;
        });
        $scope.$on('$destroy', function() {
            console.log('StatusCtrl scope destroyed. Stopping status checker');
            stopFn();
        });
        $scope.showStatus = function() {
            $modal.open({
                templateUrl: COMPONENT_ROOT + '/statusDialog.html',
                scope: $scope
            });
        };
    });

}());


