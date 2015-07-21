'use strict';

var config = require('../../../config');
var request = require('request');
var logger = require('hotrod-logger')(__filename);

var esServer = config.get('ELASTICSEARCH');

module.exports = {
    readStats: function(callback) {
        var statsUrl = 'http://' + esServer + '/_nodes/stats';
        logger.trace('Requesting stats from: ', statsUrl);
        request(statsUrl, function (err, response, body) {
            if (err) {
                logger.trace('Error reading stats: ', err);
                return callback(err);
            }
            if (response.statusCode !== 200) {
                var errMsg = 'Unexpected status code from stats endpoint. Expected 200, got:' + response.statusCode;
                logger.trace(errMsg);
                return callback(errMsg);
            }

            var statsObject = JSON.parse(body);
            var wantedStats = [];
            for (var nodeName in statsObject.nodes) {
                if (statsObject.nodes.hasOwnProperty(nodeName)) {
                    var nodeStats = statsObject.nodes[nodeName];
                    wantedStats.push({
                        "@timestamp": new Date(nodeStats.timestamp).toISOString(),
                        "nodeName": nodeName,
                        "niceName": (nodeStats.name).replace(/\s+/g, ''),
                        "heapUsedPerc": nodeStats.jvm.mem.heap_used_percent,
                        "gcTime": ((nodeStats.jvm.gc.collectors.young.collection_time_in_millis) + (nodeStats.jvm.gc.collectors.old.collection_time_in_millis)),
                        "osCpu": nodeStats.os.cpu.usage,
                        "osMem": nodeStats.os.mem.used_percent,
                        "osSwapUsedPerc": ((nodeStats.os.swap.used_in_bytes) / (nodeStats.os.swap.free_in_bytes)) * 100,
                        "osLoadAverage_1m": nodeStats.os.load_average[0],
                        "osLoadAverage_5m": nodeStats.os.load_average[1],
                        "osLoadAverage_15m": nodeStats.os.load_average[2],
                        "fileDesc": nodeStats.process.open_file_descriptors,
                        "processMem_resident": nodeStats.process.mem.resident_in_bytes,
                        "processMem_share": nodeStats.process.mem.share_in_bytes,
                        "processMem_total_virtual": nodeStats.process.mem.total_virtual_in_bytes,
                        "processCpu": nodeStats.process.cpu.percent,
                        "indiceSize": nodeStats.indices.store.size_in_bytes,
                        "fs_path": nodeStats.fs.data[0].path,
                        "fs_mount": nodeStats.fs.data[0].mount,
                        "fs_dev": nodeStats.fs.data[0].dev,
                        "fs_total": nodeStats.fs.data[0].total_in_bytes,
                        "fs_free": nodeStats.fs.data[0].free_in_bytes,
                        "fs_available": nodeStats.fs.data[0].available_in_bytes,
                        "fs_free_perc": ((nodeStats.fs.data[0].free_in_bytes)/(nodeStats.fs.data[0].total_in_bytes)) * 100
                    });
                }
            }
            callback(null, wantedStats);
        });
    }
};