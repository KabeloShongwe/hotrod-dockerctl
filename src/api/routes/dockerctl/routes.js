'use strict';

var express = require('express');
var router = express.Router();
var logger = require('hotrod-logger')(__filename);
var validate = require('input-validator');
var async = require('async');
var sitesStore = require('../../stores/sitesStore');
var config = require('../../../config');
var Docker = require('dockerode');
var docker = new Docker();
var moment = require('moment');
var MemoryStream = require('memorystream');

function resolveContainerName(containername) {
    return new Promise(function (resolve, reject) {
        docker.listContainers({}, function (err, containers) {
            if (err !== null) return reject(err);


            containers.forEach(function (c) {
                if (c["Names"][0] === "/" + containername) {
                    //logger.trace('Got the following containers:' + JSON.stringify(c, null, 2), ",", containername);
                    resolve(c["Names"][0].replace(/\//, ''));
                }
                if (c.hasOwnProperty("Labels") && c["Labels"]
                    && c["Labels"]["com.docker.compose.service"]
                    && c["Labels"]["com.docker.compose.service"] == containername) {
                    //logger.trace('Got the following containers:' + JSON.stringify(c, null, 2), ",", containername);
                    resolve(c["Names"][0].replace(/\//, ''));

                }
            });

            reject("Container (" + containername + ") not found");
        });
    });
}

function formatLine(preAmble, line) {
    let lineElements = line.split(' ');
    let timeDate = lineElements[0];
    lineElements.shift();
    return JSON.stringify({'time': timeDate, dest: preAmble, message: lineElements.join(' ')});

    //return formattedLine;
}

module.exports = function (services) {
    //var schemas = require('../../validation/commonSchemas')(services.config);

    router.get('/logs/:container', function (req, res, next) {

        let containerName = req.params.container;


        resolveContainerName(containerName)
            .then(function (resolvedContainerName) {
                var container = docker.getContainer(resolvedContainerName);

                var logs_opts = {
                    follow: false,
                    stream: true,
                    stdout: true,
                    stderr: true,
                    timestamps: true,
                    tty: false
                };

                let fromTime = parseInt(req.query.from_seconds);
                if (!isNaN(fromTime)) {

                    if (fromTime !== 0) {
                        let timestamp = moment().subtract(fromTime, 'seconds');
                        logger.trace("Now", moment().unix());
                        logger.trace("From", fromTime, "seconds ago", timestamp.unix());

                        logs_opts.since = timestamp.unix();
                    }

                } else {
                    logs_opts.tail = 10;
                }


                function handler(err, streamc) {
                    if (err) return console.log(err);


                    let first = true;

                    if (streamc) {

                        var memStreamStdout = new MemoryStream();
                        var memStreamStderr = new MemoryStream();

                        //res.set('Content-Type', 'application/vnd.docker.raw-stream');
                        res.set('Content-Type', 'application/json');
                        res.write('[');

                        memStreamStdout.on('data', function (data) {
                            //logger.trace('got %d bytes of data OUT:', data.length, data.toString());
                            //output += "OUT: " + data.toString();
                            //res.write("OUT: " + data.toString());
                            first ? first = false : res.write(',');
                            res.write(formatLine("STDOUT", data.toString()));
                        });

                        memStreamStderr.on('data', function (data) {
                            //logger.trace('got %d bytes of data ERR:', data.length, data.toString());
                            //res.write("ERR: " + data.toString());
                            first ? first = false : res.write(',');
                            res.write(formatLine("STDERR", data.toString()));
                        });

                        streamc.once('end', function () {
                            logger.trace("stream end");
                            res.write(']');
                            res.end();
                        });

                        container.modem.demuxStream(streamc, memStreamStdout, memStreamStderr);

                    }

                }

                container.logs(logs_opts, handler);

            })
            .catch(function (error) {
                console.log("Failed!", error);
                res.status(404);
                res.send('Error: ' + error);
            });


    });


    router.get('/restart/:container', function (req, res, next) {

        let containerName = req.params.container;


        resolveContainerName(containerName)
            .then(function (resolvedContainerName) {

                var opts = {
                    t: 45
                };

                function handler(err,data) {
                    if (err) return console.log(err);
                    res.send("restarted ok");
                    console.log(data);
                }

                var container = docker.getContainer(resolvedContainerName);
                container.restart(opts, handler);

            })
            .catch(function (error) {
                console.log("Failed!", error);
                res.status(404);
                res.send('Error: ' + error);
            });


    });

    router.get('/filesize/:container/*', function (req, res) {

        let containerName = req.params.container;
        let filepath = req.params[0];
                                                                                              
        resolveContainerName(containerName)
            .then(function (resolvedContainerName) {

                let container = docker.getContainer(resolvedContainerName);
                let options = {
                    Cmd: ['/bin/bash', '-c', 'du -b '+ filepath +' | cut -f1'],
                    AttachStdout: true,
                    AttachStderr: true,
                    Tty: false
                };

                container.exec(options, function(err, exec) {
                    if (err) return;
                    exec.start(function(err, stream) {
                        if (err) return;

                        res.set('Content-Type', 'application/json');

                        stream.on('data', function (data) {
                            let results = data.toString();
                            res.send(results.replace(/\s/g, ''));
                        });

                        stream.once('end', function () {
                            logger.trace("stream end");
                            res.end();
                        });
                        container.modem.demuxStream(stream, process.stdout, process.stderr);
                    });
                });
            })
            .catch(function (error) {
                console.log("Failed!", error);
                res.status(404);
                res.send('Error: ' + error);
            });
    });

    return router;
};
