(function() {
    'use strict';

    var module = angular.module('wrappers', []);

    // Seems a bit redundant, but it makes the dependency explicit when injecting into elsewhere

    module.factory('_', function() {
        return _;
    });

    module.factory('filesize', function() {
        return filesize;
    });

    module.factory('moment', function() {
        return moment;
    });
}());
