'use strict';

var Promise = require('promise');
var express = require('express');
var EsQuery = require('hotrod-dash-data/lib/query/es/esQuery');
var apiRouter = require('hotrod-dash-api/lib/apiRouter');
var FakeConfig = require('hotrod-config/tests/fakeConfig');

module.exports = {
    beforeEach: function(getRouterToTestCb, callback) {
        var fakeQueryRunner = {
            runResponse: null,
            run: function(query) {
                if (!this.runResponse) {
                    throw new Error('No run response configured for fake query runner');
                }
                return Promise.resolve(this.runResponse);
            }
        };

        var esQueryWithMockRunner = new EsQuery(fakeQueryRunner, {
            queryDefaults: {
                type: 'events',
                searchType: 'count'
            }
        });

        var services = {
            esQuery: esQueryWithMockRunner
        };
        var routerToTest = getRouterToTestCb(services);

        var fakeConfig = new FakeConfig({
            SIGNING_SECRET: 'foo'
        });

        var apiRouterForTest = apiRouter(fakeConfig, {
            customiseRoutes: function(router) {
                router.use(routerToTest);
            }
        });

        var app = express();
        app.use(apiRouterForTest);

        callback(app, fakeQueryRunner);
    }
};