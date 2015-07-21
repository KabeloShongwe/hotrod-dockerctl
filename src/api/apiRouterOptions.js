'use strict';

var _ = require('lodash');
var path = require('path');

var config = require('../config');
var esQuery = require('./esQuery');

module.exports = {
    routesDir: path.join(__dirname, './routes'),
    customiseServices: function(services) {
        services.esQuery = esQuery;
    },
    customiseRoutes: function(apiRouter, routersByDirName, authMiddleware) {
        var API_VER = '/v1';

        // Unauthenticated routes go here

        // Require valid JWT token for all routes below here
        apiRouter.use(authMiddleware);

        // Authenticated routes:
        _.each(routersByDirName, function(routerX) {
            apiRouter.use(API_VER, routerX);
        });
    }
};