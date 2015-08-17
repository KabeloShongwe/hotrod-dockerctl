'use strict';

var path = require('path');
var configDir = path.join(__dirname, 'config');

module.exports = require('hotrod-config')(configDir);
