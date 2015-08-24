'use strict';

var path = require('path');
var config = require('../config');
var esHost = config.getRequired('ELASTICSEARCH');
var es = require('hotrod-dash-data').es;

module.exports = es.client(esHost, {
    restartOnNoLivConn: config.get('RESTART_ON_NO_LIVING_CONNECTIONS'),
    noLivConnRestartDelayMs: 1000 * (parseInt(config.get('NO_LIVING_CONNECTIONS_RESTART_DELAY_SECS')) || 10),
    testMode: 'TEST_MODE' in process.env,
    testDataDir: path.resolve(path.join(__dirname, 'test_data/'))
});