'use strict';

var fs = require('fs');
var jsYaml = require('js-yaml');

function readYamlObj(path, cb) {
    readText(path, function(err, contents) {
        if (err) {
            return cb(err);
        }

        var yaml = contents ? jsYaml.safeLoad(contents) : null;
        cb(null, yaml);
    });
}

function readText(path, cb) {
    fs.readFile(path, 'utf8', function(err, contents) {
        if (err) {
            if (err.code === 'ENOENT') {
                return cb(null, null);
            } else {
                return cb(err);
            }
        }

        cb(null, contents);
    });
}

exports.readYamlObj = readYamlObj;
