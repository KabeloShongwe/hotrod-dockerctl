(function() {
    'use strict';

    var module = angular.module('filters', ['wrappers']);

    module.filter('error', function(_) {
        return function(err) {
            if (!err) {
                return [];
            }

            if (typeof err === 'string') {
                return [ err ];
            }

            var errMsg = err.msg || err.message;
            if (errMsg) {
                return [ errMsg ];
            }

            if (err.data) {

                if (typeof err.data === 'string') {
                    return [ err.data ];
                }

                // Assume it's an array of validation errors as returned from https://github.com/ctavan/express-validator
                var messages = _.pluck(err.data, 'msg');
                if (messages && messages.length) {
                    return messages;
                }
            }

            return [ 'Error' ];
        };
    });

    module.filter('interval', function(moment) {
        return function(dateString, format) {
            return (format === 'fromNow')
                ? moment(dateString).fromNow()
                : moment().diff(moment(dateString), format || 'seconds');
        };
    });
}());
