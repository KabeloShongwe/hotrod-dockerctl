'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var logger = require('hotrod-logger')(__filename);
var async = require('async');
var utils = require('hotrod-dash-data').utils;
var helpers = require('hotrod-dash-data').expressHelpers;
var validate = require('input-validator');
var responses = require('hotrod-dash-data/lib/responseBuilders');
var _ = require('lodash');
var statsService = require('./statsService');

module.exports = function(services) {
    var schemas = require('../../validation/commonSchemas')(services.config);
    var queries = services.esQuery.parseTemplates(require('./queries'));

    router.get('/stats', function (req, res, next) {
        statsService.readStats(function(err, stats) {
            if (err) {
                return next(err);
            }
            res.json(stats);
        });
    });

    router.get('/server/heapusedperc/:nodeName', function (req, res, next) {
        var params = validate(req.params, req.query, schemas.nodeName, schemas.dateRange, schemas.interval, schemas.intervalsCount);
        helpers.runQuery(queries.heapUsedPerc, params, req, res, next, {
            queryModifier: function (query){
                query.index = 'serverstats-*';
                query.type = 'stats';
                return query;
            },
            responseBuilder: responses.timeChart.bind(null, { sortByKey: true })
        });
    });

    router.get('/server/indicesize/:nodeName', function (req, res, next) {
        var params = validate(req.params, req.query, schemas.nodeName, schemas.dateRange, schemas.interval, schemas.intervalsCount);
        helpers.runQuery(queries.indiceSize, params, req, res, next, {
            queryModifier: function (query){
                query.index = 'serverstats-*';
                query.type = 'stats';
                return query;
            },
            responseBuilder: responses.timeChart.bind(null, { sortByKey: true })
        });
    });

    router.get('/server/os_and_process_cpu_usage/:nodeName', function (req, res, next) {
        var params = validate(req.params, req.query, schemas.nodeName, schemas.dateRange, schemas.interval, schemas.intervalsCount);
        helpers.runQuery(queries.os_and_process_cpu_usage, params, req, res, next, {
            queryModifier: function (query){
                query.index = 'serverstats-*';
                query.type = 'stats';
                return query;
            },
            responseBuilder: responses.timeChart.bind(null, { sortByKey: true })
        });
    });

    router.get('/server/osloadaverage_1m_5m_15m/:nodeName', function (req, res, next) {
        var params = validate(req.params, req.query, schemas.nodeName, schemas.dateRange, schemas.interval, schemas.intervalsCount);
        helpers.runQuery(queries.osLoadAverage_1m_5m_15m, params, req, res, next, {
            queryModifier: function (query){
                query.index = 'serverstats-*';
                query.type = 'stats';
                return query;
            },
            responseBuilder: responses.timeChart.bind(null, { sortByKey: true })
        });
    });

    router.get('/server/osmem/:nodeName', function (req, res, next) {
        var params = validate(req.params, req.query, schemas.nodeName, schemas.dateRange, schemas.interval, schemas.intervalsCount);
        helpers.runQuery(queries.osMem, params, req, res, next, {
            queryModifier: function (query){
                query.index = 'serverstats-*';
                query.type = 'stats';
                return query;
            },
            responseBuilder: responses.timeChart.bind(null, { sortByKey: true })
        });
    });

    router.get('/server/processmemall/:nodeName', function (req, res, next) {
        var params = validate(req.params, req.query, schemas.nodeName, schemas.dateRange, schemas.interval, schemas.intervalsCount);
        helpers.runQuery(queries.processMemAll, params, req, res, next, {
            queryModifier: function (query){
                query.index = 'serverstats-*';
                query.type = 'stats';
                return query;
            },
            responseBuilder: responses.timeChart.bind(null, { sortByKey: true })
        });
    });

    router.get('/server/gctime/:nodeName', function (req, res, next) {
        var params = validate(req.params, req.query, schemas.nodeName, schemas.dateRange, schemas.interval, schemas.intervalsCount);
        helpers.runQuery(queries.gcTime, params, req, res, next, {
            queryModifier: function (query){
                query.index = 'serverstats-*';
                query.type = 'stats';
                return query;
            },
            responseBuilder: responses.timeChart.bind(null, { sortByKey: true })
        });
    });

    router.get('/server/latestnodeinfo', function (req, res, next) {
        var params = validate(req.query, schemas.dateRange, schemas.interval, schemas.intervalsCount);
        queryLatestNodeInfo(params, req, res, next);
    });

    router.get('/server/nodeinfo', function (req, res, next) {
        var params = validate(req.query, schemas.dateRange, schemas.interval, schemas.intervalsCount, schemas.paging, schemas.sort);
        params.nodeFilter = (req.query.nodeFilter || '').toLowerCase();
        return queryLatestNodeInfo(params, req, res, next);
    });

    function queryLatestNodeInfo(params, req, res, next) {
        helpers.runQuery(queries.nodeInfo, params, req, res, next, {
            queryModifier: function (query){
                query.index = 'serverstats-*';
                query.type = 'stats';
                return query;
            },
            responseBuilder: function buildResponse(response) {
                response.results = _.map(response.results.aggregations["Node Name"].buckets, function(bucket) {
                    var nodeName = bucket.key;
                    var freeDiskSpacePerc = bucket["Free Disk Space Percentage"].value;
                    var heapUsed = bucket["Heap Used Percentage"].value;
                    return {
                        Node: nodeName,
                        DiskSpacePercentage: freeDiskSpacePerc,
                        HeapUsedPercentage: heapUsed
                    };
                });
                if (params.nodeFilter) {
                    response.results = _.filter(response.results, function(result) {
                        return result.Node.toLowerCase().indexOf(params.nodeFilter) !== -1;
                    });
                }
                return response;
            }
        });
    }

    return router;
};




