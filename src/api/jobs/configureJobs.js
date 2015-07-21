'use strict';

var config = require('../../config');
var jobRunner = require('hotrod-dash-api/lib/jobs/jobRunner');
var serverStatsJob = require('./serverStatsJob')();

var serverUpdateIntervalSeconds = parseInt(config.getRequired('SERVER_UPDATE_INTERVAL_SECS'));

module.exports = function() {
    jobRunner.runContinuous(serverStatsJob, serverUpdateIntervalSeconds);
};