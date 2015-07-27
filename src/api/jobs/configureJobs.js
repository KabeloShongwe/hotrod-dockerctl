'use strict';

var config = require('../../config');
var jobs = require('hotrod-jobs');
var serverStatsJob = require('./serverStatsJob')();

var serverUpdateIntervalSeconds = parseInt(config.getRequired('SERVER_UPDATE_INTERVAL_SECS'));

module.exports = function() {
    jobs.runContinuous(serverStatsJob, serverUpdateIntervalSeconds);
};