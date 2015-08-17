'use strict';

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;

var moment = require('moment');
var ms = require('ms');
var FakeConfig = require('hotrod-config/tests/fakeConfig');
var routeTestHelper = require('../routeTestHelper');
var RouteValidationTestHelper = require('../routeValidationTestHelper');

describe('Server Routes', function() {
    var app;

    beforeEach(function() {
        var config = new FakeConfig({
            MAX_AGG_BUCKETS: 250
        });
        routeTestHelper.beforeEach(function getRouterToTest(services) {
            services.config = config;
            return require('./routes')(services);
        }, function(_app) {
            app = _app;
        });
    });

    describe('Route /server/heapusedperc/:nodeName', function() {

        var validQuery;
        var validationHelper;

        beforeEach(function() {
            validQuery = {
                from: moment().subtract(1, 'days').valueOf(),
                to: moment().valueOf(),
                interval: ms('1h')
            };
            validationHelper = new RouteValidationTestHelper(app, {
                validQuery: validQuery,
                routeBase: '/server/heapusedperc',
                validRoute: '/server/heapusedperc/node1'
            });
        });

        it('validates node name is a valid host name', function(done) {
            validationHelper.validatesNodeName(done);
        });

        it('validates from date', function(done) {
            validationHelper.validatesFromDate(done);
        });

        it('validates to date', function(done) {
            validationHelper.validatesToDate(done);
        });

        it('validates interval', function(done) {
            validationHelper.validatesInterval(done);
        });

        it('validates max aggregation buckets', function(done) {
            validationHelper.validatesMaxAggregationBuckets(done);
        });
    });

    describe('Route /server/indicesize/:nodeName', function() {

        var validQuery;
        var validationHelper;

        beforeEach(function() {
            validQuery = {
                from: moment().subtract(1, 'days').valueOf(),
                to: moment().valueOf(),
                interval: ms('1h')
            };
            validationHelper = new RouteValidationTestHelper(app, {
                validQuery: validQuery,
                routeBase: '/server/indicesize',
                validRoute: '/server/indicesize/node1'
            });
        });

        it('validates node name is a valid host name', function(done) {
            validationHelper.validatesNodeName(done);
        });

        it('validates from date', function(done) {
            validationHelper.validatesFromDate(done);
        });

        it('validates to date', function(done) {
            validationHelper.validatesToDate(done);
        });

        it('validates interval', function(done) {
            validationHelper.validatesInterval(done);
        });

        it('validates max aggregation buckets', function(done) {
            validationHelper.validatesMaxAggregationBuckets(done);
        });
    });

    describe('Route /server/os_and_process_cpu_usage/:nodeName', function() {

        var validQuery;
        var validationHelper;

        beforeEach(function() {
            validQuery = {
                from: moment().subtract(1, 'days').valueOf(),
                to: moment().valueOf(),
                interval: ms('1h')
            };
            validationHelper = new RouteValidationTestHelper(app, {
                validQuery: validQuery,
                routeBase: '/server/os_and_process_cpu_usage',
                validRoute: '/server/os_and_process_cpu_usage/node1'
            });
        });

        it('validates node name is a valid host name', function(done) {
            validationHelper.validatesNodeName(done);
        });

        it('validates from date', function(done) {
            validationHelper.validatesFromDate(done);
        });

        it('validates to date', function(done) {
            validationHelper.validatesToDate(done);
        });

        it('validates interval', function(done) {
            validationHelper.validatesInterval(done);
        });

        it('validates max aggregation buckets', function(done) {
            validationHelper.validatesMaxAggregationBuckets(done);
        });
    });

    describe('Route /server/osloadaverage_1m_5m_15m/:nodeName', function() {

        var validQuery;
        var validationHelper;

        beforeEach(function() {
            validQuery = {
                from: moment().subtract(1, 'days').valueOf(),
                to: moment().valueOf(),
                interval: ms('1h')
            };
            validationHelper = new RouteValidationTestHelper(app, {
                validQuery: validQuery,
                routeBase: '/server/osloadaverage_1m_5m_15m',
                validRoute: '/server/osloadaverage_1m_5m_15m/node1'
            });
        });

        it('validates node name is a valid host name', function(done) {
            validationHelper.validatesNodeName(done);
        });

        it('validates from date', function(done) {
            validationHelper.validatesFromDate(done);
        });

        it('validates to date', function(done) {
            validationHelper.validatesToDate(done);
        });

        it('validates interval', function(done) {
            validationHelper.validatesInterval(done);
        });

        it('validates max aggregation buckets', function(done) {
            validationHelper.validatesMaxAggregationBuckets(done);
        });
    });

    describe('Route /server/osmem/:nodeName', function() {

        var validQuery;
        var validationHelper;

        beforeEach(function() {
            validQuery = {
                from: moment().subtract(1, 'days').valueOf(),
                to: moment().valueOf(),
                interval: ms('1h')
            };
            validationHelper = new RouteValidationTestHelper(app, {
                validQuery: validQuery,
                routeBase: '/server/osmem',
                validRoute: '/server/osmem/node1'
            });
        });

        it('validates node name is a valid host name', function(done) {
            validationHelper.validatesNodeName(done);
        });

        it('validates from date', function(done) {
            validationHelper.validatesFromDate(done);
        });

        it('validates to date', function(done) {
            validationHelper.validatesToDate(done);
        });

        it('validates interval', function(done) {
            validationHelper.validatesInterval(done);
        });

        it('validates max aggregation buckets', function(done) {
            validationHelper.validatesMaxAggregationBuckets(done);
        });
    });

    describe('Route /server/processmemall/:nodeName', function() {

        var validQuery;
        var validationHelper;

        beforeEach(function() {
            validQuery = {
                from: moment().subtract(1, 'days').valueOf(),
                to: moment().valueOf(),
                interval: ms('1h')
            };
            validationHelper = new RouteValidationTestHelper(app, {
                validQuery: validQuery,
                routeBase: '/server/processmemall',
                validRoute: '/server/processmemall/node1'
            });
        });

        it('validates node name is a valid host name', function(done) {
            validationHelper.validatesNodeName(done);
        });

        it('validates from date', function(done) {
            validationHelper.validatesFromDate(done);
        });

        it('validates to date', function(done) {
            validationHelper.validatesToDate(done);
        });

        it('validates interval', function(done) {
            validationHelper.validatesInterval(done);
        });

        it('validates max aggregation buckets', function(done) {
            validationHelper.validatesMaxAggregationBuckets(done);
        });
    });

    describe('Route /server/gctime/:nodeName', function() {

        var validQuery;
        var validationHelper;

        beforeEach(function() {
            validQuery = {
                from: moment().subtract(1, 'days').valueOf(),
                to: moment().valueOf(),
                interval: ms('1h')
            };
            validationHelper = new RouteValidationTestHelper(app, {
                validQuery: validQuery,
                routeBase: '/server/gctime',
                validRoute: '/server/gctime/node1'
            });
        });

        it('validates node name is a valid host name', function(done) {
            validationHelper.validatesNodeName(done);
        });

        it('validates from date', function(done) {
            validationHelper.validatesFromDate(done);
        });

        it('validates to date', function(done) {
            validationHelper.validatesToDate(done);
        });

        it('validates interval', function(done) {
            validationHelper.validatesInterval(done);
        });

        it('validates max aggregation buckets', function(done) {
            validationHelper.validatesMaxAggregationBuckets(done);
        });
    });

    describe('Route /server/latestnodeinfo', function() {

        var validQuery;
        var validationHelper;

        beforeEach(function() {
            validQuery = {
                from: moment().subtract(1, 'days').valueOf(),
                to: moment().valueOf(),
                interval: ms('1h')
            };
            validationHelper = new RouteValidationTestHelper(app, {
                validQuery: validQuery,
                validRoute: '/server/latestnodeinfo'
            });
        });

        it('validates from date', function(done) {
            validationHelper.validatesFromDate(done);
        });

        it('validates to date', function(done) {
            validationHelper.validatesToDate(done);
        });

        it('validates interval', function(done) {
            validationHelper.validatesInterval(done);
        });

        it('validates max aggregation buckets', function(done) {
            validationHelper.validatesMaxAggregationBuckets(done);
        });
    });

    describe('Route /server/nodeinfo', function() {

        var validQuery;
        var validationHelper;

        beforeEach(function() {
            validQuery = {
                from: moment().subtract(1, 'days').valueOf(),
                to: moment().valueOf(),
                interval: ms('1h'),
                sort: [],
                pageFrom: 0,
                pageSize: 10
            };
            validationHelper = new RouteValidationTestHelper(app, {
                validQuery: validQuery,
                validRoute: '/server/nodeinfo'
            });
        });

        it('validates from date', function(done) {
            validationHelper.validatesFromDate(done);
        });

        it('validates to date', function(done) {
            validationHelper.validatesToDate(done);
        });

        it('validates interval', function(done) {
            validationHelper.validatesInterval(done);
        });

        it('validates max aggregation buckets', function(done) {
            validationHelper.validatesMaxAggregationBuckets(done);
        });

        it('validates paging params', function(done) {
            validationHelper.validatesPagingParams(done);
        });

        it('validates sort', function(done) {
            validationHelper.validatesSortParams(done);
        });
    });
});