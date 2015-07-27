'use strict';

var jobs = require('hotrod-jobs');
var Promise = require('promise');
var _ = require('lodash');
var config = require('../../config');
var esClient = require('../elasticsearch');

var statsService = require('../routes/server/statsService');

module.exports = function() {

    function writeStats(statsObj, logger) {
        return new Promise(function(resolve, reject) {
            logger.trace('Writing stats:', statsObj);
            esClient.create({
                index: 'serverstats-' + new Date().toJSON().slice(0, 10),
                type: 'stats',
                body: statsObj
            }, function(error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }

    var JOB_NAME = 'updateServerStats';

    return jobs.create(JOB_NAME, function(resolve, reject, logger) {
        logger.debug('Start: ' + JOB_NAME + '. Updating stats');

        statsService.readStats(function(err, statsArray) {
            if (err) {
                return reject(err);
            }

            var promises = _.map(statsArray, function(statsObj) {
                return writeStats(statsObj, logger);
            });

            Promise.all(promises).then(function() {
                resolve();
            }, function(err) {
                reject(err);
            });
        });
    });
};
