var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var assert = chai.assert;
var Joi = require('joi');
var FakeConfig = require('hotrod-config/tests/fakeConfig');
var validate = require('input-validator');

var MAX_INTERVALS = 10;

describe('Common Schemas', function() {

    var schemas;
    beforeEach(function() {

        var config = new FakeConfig({
            MAX_AGG_BUCKETS: MAX_INTERVALS
        });
        schemas = require('../../../src/api/validation/commonSchemas')(config);
    });

    describe('Sort Params', function() {

        it('can validate sort params - success case', function() {
            var input = {
                sort: [
                    '{"site":false}',
                    '{"lossPerc":true}'
                ]
            };

            var validatedParams = validate(input, schemas.sort);

            assert.deepEqual(validatedParams, {
                sort: [
                    {"site":false},
                    {"lossPerc":true}
                ]
            });
        });

        it('can validate sort params - empty array success case', function() {
            var input = {
                sort: []
            };

            var validatedParams = validate(input, schemas.sort);

            assert.deepEqual(validatedParams, {
                sort: []
            });
        });

        it('can validate sort params - not supplied success case', function() {
            var input = {
            };

            var validatedParams = validate(input, schemas.sort);

            assert.deepEqual(validatedParams, {
                sort: []
            });
        });
    });

    describe('Paging Params', function() {

        it('can validate paging params - success case', function() {
            var input = {
                pageFrom: 1,
                pageSize: 10
            };

            var result = Joi.validate(input, schemas.paging);

            assert.isNull(result.error);
            assert.deepEqual(result.value, {
                pageFrom: 1,
                pageSize: 10
            });
        });

        it('can validate paging params - missing pageFrom failure case', function() {
            var input = {
                // pageFrom: 1,
                pageSize: 10
            };

            var result = Joi.validate(input, schemas.paging);

            assertHasError(result, '"pageFrom" is required');
        });

        it('can validate paging params - missing pageSize failure case', function() {
            var input = {
                pageFrom: 1
                // pageSize: 10
            };

            var result = Joi.validate(input, schemas.paging);

            assertHasError(result, '"pageSize" is required');
        });

        it('can validate paging params - pageFrom < 0 failure case', function() {
            var input = {
                pageFrom: -1,
                pageSize: 10
            };

            var result = Joi.validate(input, schemas.paging);

            assertHasError(result, '"pageFrom" must be larger than or equal to 0');
        });

        it('can validate paging params - pageFrom max failure case', function() {
            var input = {
                pageFrom: 10001,
                pageSize: 10
            };

            var result = Joi.validate(input, schemas.paging);

            assertHasError(result, '"pageFrom" must be less than or equal to 10000');
        });

        it('can validate paging params - pageSize <= 0 failure case', function() {
            var input = {
                pageFrom: 0,
                pageSize: 0
            };

            var result = Joi.validate(input, schemas.paging);

            assertHasError(result, '"pageSize" must be larger than or equal to 1');
        });

        it('can validate paging params - pageSize max failure case', function() {
            var input = {
                pageFrom: 0,
                pageSize: 51
            };

            var result = Joi.validate(input, schemas.paging);

            assertHasError(result, '"pageSize" must be less than or equal to 50');
        });
    });

    describe('Date Range', function() {

        it('can validate date range - success case', function() {
            var input = {
                from: '1436000001000',
                to: 1436000002000
            };

            var result = Joi.validate(input, schemas.dateRange);
            assert.isNull(result.error);
            assert.deepEqual(result.value, {
                from: 1436000001000,
                to: 1436000002000
            });
        });

        it('can validate date range - missing "to" failure case', function() {
            var input = {
                from: '1436000001000'
            };

            var result = Joi.validate(input, schemas.dateRange.required());

            assertHasError(result, '"to" is required');
        });

        it('can validate date range - invalid "to" failure case', function() {
            var input = {
                from: 1436000001000,
                to: 'aaa'
            };

            var result = Joi.validate(input, schemas.dateRange.required());

            assertHasError(result, '"to" must be a number');
        });

        it('can validate date range - missing "from" failure case', function() {
            var input = {
                to: '1436000001000'
            };

            var result = Joi.validate(input, schemas.dateRange.required());

            assertHasError(result, '"from" is required');
        });

        it('can validate date range - invalid "from" failure case', function() {
            var input = {
                from: 'aaa'
            };

            var result = Joi.validate(input, schemas.dateRange.required());

            assertHasError(result, '"from" must be a number');
        });
    });

    describe('Interval', function() {

        it('can validate interval - success case', function() {
            var input = {
                interval: 100
            };

            var result = Joi.validate(input, schemas.interval);

            assert.isNull(result.error);
            assert.deepEqual(result.value, {
                interval: 100
            });
        });

        it('can validate interval - required failure case', function() {
            var input = {
                // interval: 100
            };

            var result = Joi.validate(input, schemas.interval);

            assertHasError(result, '"interval" is required');
        });

        it('can validate interval - invalid failure case', function() {
            var input = {
                interval: 'aaa'
            };

            var result = Joi.validate(input, schemas.interval);

            assertHasError(result, '"interval" must be a number');
        });
    });

    describe('Intervals Count', function() {

        it('can validate count of intervals - success case', function() {
            var input = {
                from: 1000,
                to: 2000,
                interval: 100
            };

            var validatedParams = validate(input, schemas.dateRange, schemas.interval, schemas.intervalsCount);

            assert.deepEqual(validatedParams, {
                from: 1000,
                to: 2000,
                interval: 100
            });
        });

        it('can validate count of intervals - min failure case', function() {
            var input = {
                from: 1000,
                to: 1000,
                interval: 100
            };

            var error = assert.throws(function() {
                validate(input, schemas.dateRange, schemas.interval, schemas.intervalsCount);
            });

            assertValidationErr(error, 'Aggregation interval resulted in too many or too few chart columns - please try a different value');
        });
    });

    describe('Node name', function() {

        it('can validate node name - success case', function() {
            var input = {
                nodeName: 'bar'
            };

            var validatedParams = validate(input, schemas.nodeName);

            assert.deepEqual(validatedParams, {
                nodeName: 'bar'
            });
        });

        it('can validate node name - failure case', function() {
            var input = {
                nodeName: '$invalid*ho$tn$m€'
            };
            var error = assert.throws(function() {
                validate(input, schemas.nodeName);
            });
            assertValidationErr(error, '"nodeName" must be a valid hostname');
        });
    });

    function assertValidationErr(error, expectedMessage, done) {
        try {
            assert.equal(error.name, 'ValidationError');
            assert.equal(error.message.length, 1);
            assert.equal(error.message[0].message, expectedMessage);
        } catch (e) {
            if (done) {
                done(e);
            } else {
                throw e;
            }
        }
    }

    function assertHasError(validationResult, expectedMessage) {
        assert.ok(validationResult.error, 'Has error');
        assert.equal(validationResult.error.details.length, 1);
        assert.equal(validationResult.error.details[0].message, expectedMessage);
    }
});