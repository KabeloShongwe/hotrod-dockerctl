'use strict';

var express = require('express');
var router = express.Router();
var esClient = require('../../elasticsearch');
var logger = require('hotrod-logger')(__filename);

module.exports = function(services) {

    router.get('/status/', function(req, res) {
        var esPingTimeout = parseInt(services.config.get('ES_PING_TIMEOUT'));
        esClient.ping({
            requestTimeout: esPingTimeout,
            // undocumented params are appended to the query string
            hello: "elasticsearch!"
        }, function(error) {
            if (error) {
                logger.trace('elasticsearch cluster is down!', error);
                res.status(404).json({message: 'Offline', status: false});

            } else {
                res.status(200).json({message: 'Online', status: true});
                return res;
            }
        });
    });

    return router;
};