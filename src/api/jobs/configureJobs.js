'use strict';

var config = require('../../config');
var jobs = require('hotrod-jobs');
var moment = require('moment');
var esClient = require('../elasticsearch');

var serverUpdateIntervalSeconds = parseInt(config.getRequired('SERVER_UPDATE_INTERVAL_SECS'));
var indexCleanupIntervalSeconds = parseInt(config.getRequired('ES_INDEX_CLEANUP_INTERVAL_SECS'));

var cleanupLogstashIndices = require('hotrod-job-es-index-cleanup')({
    esClient: esClient,
    index: 'serverstats-*',
    skip: parseInt(config.getRequired('ES_INDEX_CLEANUP_SPAN')),
    action: 'close',
    whatIf: config.getRequired('ES_INDEX_CLEANUP_WHATIF')
});

var serverStatsJob = require('./serverStatsJob')();

module.exports = function() {
    jobs.runContinuous(serverStatsJob, serverUpdateIntervalSeconds);
    jobs.runContinuous(cleanupLogstashIndices, indexCleanupIntervalSeconds);
};