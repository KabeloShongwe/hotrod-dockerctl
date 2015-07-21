'use strict';

var request = require("supertest-as-promised");
var _ = require('lodash');

function RouteValidationTestHelper(app, options) {
    this.app = app;
    this.validQuery = options.validQuery;
    this.validRoute = options.validRoute;
    this.routeBase = options.routeBase; // << Use routeBase for per-node routes
}

RouteValidationTestHelper.prototype.validatesNodeName = function(done) {
    var path = this.routeBase + '/$invalid*ho$tn$m€';
    _ensureValidationError.call(this, {
        path: path,
        query: this.validQuery,
        expectedError: '"nodeName" must be a valid hostname'
    }, done);
};

RouteValidationTestHelper.prototype.validatesFromDate = function(done) {
    var invalidQuery = _.clone(this.validQuery);
    delete invalidQuery.from;

    _ensureValidationError.call(this, {
        path: this.validRoute,
        query: invalidQuery,
        expectedError: '"from" is required'
    }, done);
};

RouteValidationTestHelper.prototype.validatesToDate = function(done) {
    var invalidQuery = _.clone(this.validQuery);
    delete invalidQuery.to;

    _ensureValidationError.call(this, {
        path: this.validRoute,
        query: invalidQuery,
        expectedError: '"to" is required'
    }, done);
};

RouteValidationTestHelper.prototype.validatesInterval = function(done) {
    var invalidQuery = _.clone(this.validQuery);
    delete invalidQuery.interval;

    _ensureValidationError.call(this, {
        path: this.validRoute,
        query: invalidQuery,
        expectedError: '"interval" is required'
    }, done);
};

RouteValidationTestHelper.prototype.validatesMaxAggregationBuckets = function(done) {
    var invalidQuery = _.clone(this.validQuery);
    invalidQuery.to = invalidQuery.from;

    _ensureValidationError.call(this, {
        path: this.validRoute,
        query: invalidQuery,
        expectedError: 'Aggregation interval resulted in too many or too few chart columns - please try a different value'
    }, done);
};

RouteValidationTestHelper.prototype.validatesPagingParams = function(done) {
    var invalidQuery = _.clone(this.validQuery);
    delete invalidQuery.pageFrom;

    _ensureValidationError.call(this, {
        path: this.validRoute,
        query: invalidQuery,
        expectedError: '"pageFrom" is required'
    }, done);
};

RouteValidationTestHelper.prototype.validatesSortParams = function(done) {
    var invalidQuery = _.clone(this.validQuery);
    invalidQuery.sort = 'not valid';

    _ensureValidationError.call(this, {
        path: this.validRoute,
        query: invalidQuery,
        expectedError: '"sort" must be an array'
    }, done);
};

function _ensureValidationError(options, done) {
    /* jshint validthis:true */
    request(this.app)
        .get(options.path)
        .query(options.query)
        .expect(400, options.expectedError, done);
}

module.exports = RouteValidationTestHelper;