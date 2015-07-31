'use strict';

var config = require('../../config');
var jobs = require('hotrod-jobs');
var moment = require('moment');

var serverUpdateIntervalSeconds = parseInt(config.getRequired('SERVER_UPDATE_INTERVAL_SECS'));
var indexCleanupIntervalSeconds = parseInt(config.getRequired('ES_INDEX_CLEANUP_INTERVAL_SECS'));
var esHost = config.getRequired('ELASTICSEARCH');


var compareFunc = function(date1, date2) {
    var d1 = moment(date1.split("serverstats-")[1],"YYYY-MM-DD");
    var d2 = moment(date2.split("serverstats-")[1],"YYYY-MM-DD");
    return (d1 < d2) ? -1 : (d2 > d1) ? 1 : 0;
};

var cleanupLogstashIndices = require('hotrod-job-es-index-cleanup')(esHost, {
    index: 'serverstats-*',
    skip: config.getRequired('ES_INDEX_CLEANUP_SPAN'),
    indexNameCompare: compareFunc,
    action: 'delete',
    whatIf: config.getRequired('ES_INDEX_CLEANUP_WHATIF')
});

var serverStatsJob = require('./serverStatsJob')();

module.exports = function() {
    jobs.runContinuous(serverStatsJob, serverUpdateIntervalSeconds);
    jobs.runContinuous(cleanupLogstashIndices, indexCleanupIntervalSeconds);
};