'use strict';

var config = require('../../config');
var jobs = require('hotrod-jobs');

var serverUpdateIntervalSeconds = parseInt(config.getRequired('SERVER_UPDATE_INTERVAL_SECS'));
var indexCleanupIntervalSeconds = parseInt(config.getRequired('ES_INDEX_CLEANUP_INTERVAL_SECS'));
var esHost = config.getRequired('ELASTICSEARCH');

var cleanupLogstashIndices = require('hotrod-job-es-index-cleanup')(esHost, {
    index: 'serverstats-*',
    skip: 30,
    action: 'close',
    whatIf: true
});

var serverStatsJob = require('./serverStatsJob')();

module.exports = function() {
    jobs.runContinuous(serverStatsJob, serverUpdateIntervalSeconds);
    jobs.runContinuous(cleanupLogstashIndices, indexCleanupIntervalSeconds);
};