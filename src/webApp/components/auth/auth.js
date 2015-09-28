(function() {
    'use strict';

    var module = angular.module('dash.auth', ['authServices', 'ui.bootstrap', 'messages', 'valstrap']);
    var COMPONENT_ROOT = 'components/auth';

    module.controller('ChangePasswordCtrl', function($scope, $modal, authService, messages) {
        $scope.changePassword = function() {
            var modalInstance = $modal.open({
                templateUrl: COMPONENT_ROOT + '/changePasswordDlg.html',
                controller: function($scope) {
                    $scope.changeModel = {};

                    $scope.changePasswordFormSubmit = function() {
                        messages.clear();
                        if (!$scope.form.$valid) {
                            return;
                        }
                        authService.changePassword(
                            $scope.changeModel.oldPassword,
                            $scope.changeModel.newPassword,
                            $scope.changeModel.confirmNewPassword
                        ).then(function() {
                            messages.success('Changed password successfully', 3000);
                            modalInstance.close();
                        }, function(err) {
                            messages.error(err);
                        });
                    };

                    $scope.cancel = function() {
                        messages.clear();
                        modalInstance.dismiss();
                    };
                }
            });
        };
    });
}());
