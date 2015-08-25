'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var logger = require('hotrod-logger')(__filename);
var async = require('async');
var utils = require('hotrod-dash-data/lib/utils');
var validate = require('input-validator');
var config = require('../../../config');
var fs = require('fs');
var responses = require('hotrod-dash-data/lib/responseBuilders');
var _ = require('lodash');
var Docker = require('dockerode');
//var jsYaml = require('js-yaml');
var Promise = require('promise');

var docker = new Docker();

function runExec(functionOptions) {
    var options = {
        AttachStdout: true,
        AttachStderr: true,
        AttachStdin: false,
        Tty: false,
        Cmd: functionOptions.cmd
    };
    var container = docker.getContainer(functionOptions.container);
    container.exec(options, function(err, exec) {
        if (err) {
            return err;
        }

        logger.trace('Executing in Docker: ', functionOptions.cmd);

        exec.start(function(err, stream) {
            if (err) return;

            stream.setEncoding('hex');

            stream.on('readable', function() {
                var returned = "";
                var chunk;
                while (null !== (chunk = stream.read())) {
                    logger.trace('got %d bytes of data', chunk.length);
                    returned = returned + chunk;
                }
                logger.trace('stream done');

                function hex2a(hex)
                {
                    var str = '';
                    for (var i = 0; i < hex.length; i += 2)
                        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                    return str;
                }

                //FIXME: clear console issues
                returned = returned.replace(/^.+(7b.+)/, "$1").replace(/^(7b.+7d).+/, "$1");
                returned = hex2a(returned).replace(/\'/g,'"');

                try {
                    var content = JSON.parse(returned);
                } catch (err) {
                    logger.error(err);
                }

                functionOptions.responseBuilder(returned);

                functionOptions.res.json(content);


            });

            stream.once('close', function(){
                logger.trace("stream close");
            });

            stream.once('end', function(){
                logger.trace("stream end");
            });

            stream.once('error', function(err){
                logger.error(err);
            });

        });
    });
}



module.exports = function(services) {
    var schemas = require('../../validation/commonSchemas')(services.config);

    //List of all "accepted", "unaccepted/denied" keys
    //1) We want to use the "unaccepted" keys to "seed" which Minions can be accepted (see below)
    //2) We want to use the "accepted" and "denied" keys to seed which Minions can be deleted/bounced (see below)
    router.get('/salt/getMinionKeys', function (req, res, next) {

        runExec(
            {
                container: "bboxdev_extsaltmaster_1",
                cmd: ["salt-key","--out=raw"],
                res: res,
                responseBuilder: function(response){
                    console.log(response);
                }
            });
    });

    //List of current online minions, this list can be used for some of the functions below to make it more responsive
    //Should be used in the "logstash crashed" alert to see if any minions are online
    router.get('/salt/getOnlineStatus', function (req, res, next) {

        runExec(
            {
                container: "bboxdev_extsaltmaster_1",
                cmd: ["salt-run", "manage.status","--out=json","--no-color"],
                res: res,
                responseBuilder: function(response) {
                    console.log(response);
                }
            }
        );


        //FIXME: Make code suck less
        //runSaltKeyCommand ["salt-key --"]
        //runSaltMinionCommand ["salt b....,b1111,"  ..... "cmd.run","cat /bla"
        ////runSaltMinionCommand ["salt b....,b1111, ..... ","state.sls","netops.bla"]
        //
        //runSaltRunCommand("manage.status")
        //    .then(function(response){
        //
        //        //Do something with a response

        //    },next);

    });


    //TODO: Notes here:
    //For "online" commands use the following syntax
    // salt -L minion1,minion2,minion3 saltcommand --out=json
    //
    //    -L, --list          Instead of using shell globs to evaluate the target
    //                        servers, take a comma or space delimited list of
    //                        servers.
    //   saltcommand is listed below
    //

    //Reboot a specifc minion (should use the List syntax, on online minions only)
    //Command: salt -L minion1,minion2 system.reboot --out=json (will probably not return)
    //
    //router.post('/salt/rebootMinion/:bbox', function (req, res, next) {
    //
    //    runExec(docker.getContainer("bboxdev_extsaltmaster_1"),["salt","-L","minion1,minion2","system.reboot","--out=json"],res);
    //
    //});
    //


    //Accept a specific minions (should be listed as "unaccepted" by earlier command
    //Command: salt-key --yes -a minion --out=json
    //
    //router.post('/salt/acceptMinion/:bbox', function (req, res, next) {
    //
    //    runExec(docker.getContainer("bboxdev_extsaltmaster_1"),["salt-key","--yes","-a","minion","--out=json"],res);
    //
    //});
    //

    //Delete a specific minions (should be listed as "accepted" or "denied" by earlier command
    //Command: salt-key --yes -d minion --out=json
    //
    //router.post('/salt/deleteMinionKey/:bbox', function (req, res, next) {
    //    //Construct a 'target' consisting of online BBoxes
    //
    //    runExec(docker.getContainer("bboxdev_extsaltmaster_1"),["salt-key","--yes","-d","minion","--out=json"],res);
    //
    //});
    //


    //Trigger a configuration run on a specific (or list of) minions
    //Command: salt -L minion1,minion2 state.highstate --out=json
    //
    //router.post('/salt/triggerHighstate/:bbox', function (req, res, next) {
    //    //Construct a 'target' consisting of online BBoxes
    //
    //    //See command in comment
    //
    //});
    //


    //Check if a highstate is currently running (on online minion(s))
    //Command: salt -L minion1,minion2 file.file_exists /tmp/highstate_running
    //
    //router.get('/salt/isHighstateRunning', function (req, res, next) {
    //    //Construct a 'target' consisting of online BBoxes
    //
    //    //See command in comment
    //
    //});

    //Check if a minion needs a reboot (on online minion(s))
    //Command: salt -L minion1,minion2 file.file_exists /tmp/reboot_required
    //
    //router.get('/salt/rebootRequired', function (req, res, next) {
    //    //Construct a 'target' consisting of online BBoxes
    //
    //    //See command in comment
    //
    //});

    //Check if a minion needs a reboot (on online minion(s))
    //Command: salt -L minion1,minion2 file.file_exists /tmp/reboot_required
    //
    //router.get('/salt/rebootRequired', function (req, res, next) {
    //    //Construct a 'target' consisting of online BBoxes
    //
    //    //See command in comment
    //
    //});git



    return router;
};




