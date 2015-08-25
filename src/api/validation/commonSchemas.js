'use strict';

var Joi = require('joi');
var Promise = require('promise');
var _ = require('lodash');

module.exports = function(config) {
    var maxAggIntervals = parseInt(config.getRequired('MAX_AGG_BUCKETS'));

    return {
        nodeName: Joi.object().keys({
            nodeName: Joi.string().hostname().min(1).max(50).required()
        }),
        sort: function(rawInput) {
            var sortSchema = Joi.object().keys({
                sort: Joi.array().items(
                    Joi.string().min(1).max(50)
                )
            });
            var result = Joi.validate(rawInput, sortSchema, {
                stripUnknown: true,
                convert: true
            });
            if (!result.error) {
                if (!result.value.sort) {
                    result.value.sort = [];
                }
                _.each(result.value.sort, function(jsonStr, i) {
                    result.value.sort[i] = JSON.parse(jsonStr);
                });
            }
            return result;
        },
        paging: Joi.object().keys({
            pageFrom: Joi.number().integer().min(0).max(10000).required(),
            pageSize: Joi.number().integer().min(1).max(50).required()
        }),
        dateRange: Joi.object().keys({
            from: Joi.number().integer().required(),
            to: Joi.number().integer().required()
        }),
        interval: Joi.object().keys({
            interval: Joi.number().integer().required()
        }),
        intervalsCount: function(rawInput, paramsSoFar) {
            var intervalsCount = Math.floor((paramsSoFar.to - paramsSoFar.from) / paramsSoFar.interval);
            var schema = Joi.number().min(1).max(maxAggIntervals);
            var result = Joi.validate(intervalsCount, schema, {
                stripUnknown: true,
                convert: true
            });
            customiseErrorMessage(result, 'Aggregation interval resulted in too many or too few chart columns - please try a different value');
            return result;
        },
        bboxSchema: function(knownBBoxes) {
            if (!knownBBoxes) {
                throw new Error('Must provide an array of known bboxes');
            }
            return Joi.object().keys({
                bbox: Joi.string().hostname().required().concat(Joi.string().valid(knownBBoxes))
            });
        },
        bbox: function(knownBBoxes) {
            return function(rawInput, paramsSoFar) {
                var schema = this.bboxSchema(knownBBoxes);
                var result = Joi.validate({
                    // Note: allowing for previously validated bbox value, else fallback to raw value
                    bbox: paramsSoFar.bbox || rawInput.bbox
                }, schema, {
                    stripUnknown: true,
                    convert: true
                });
                customiseErrorMessage(result, 'Invalid BBox name');
                return result;
            }.bind(this);
        }
    };
};

function customiseErrorMessage(validationResult, customMsg) {
    // No other way to provide a really custom error message: https://github.com/hapijs/joi/issues/546
    if (validationResult.error && validationResult.error.details && validationResult.error.details[0]) {
        validationResult.error.details[0].message = customMsg;
    }
}
