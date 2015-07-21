'use strict';

var path = require('path');
var configDir = path.join(__dirname, 'config');

module.exports = require('hotrod-dash-api/lib/config')(configDir);
