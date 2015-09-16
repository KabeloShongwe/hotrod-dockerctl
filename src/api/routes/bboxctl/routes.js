'use strict';

var express = require('express');
var router = express.Router();
var logger = require('hotrod-logger')(__filename);
var SaltService = require('./saltService');
var validate = require('input-validator');
var async = require('async');
var sitesStore = require('../../stores/sitesStore');
var config = require('../../../config');
var saltSvc = new SaltService(config.getRequired('DOCKER_CONTAINER'));

module.exports = function(services) {
    var schemas = require('../../validation/commonSchemas')(services.config);

    //List of all "accepted", "unaccepted/denied" keys
    //1) We want to use the "unaccepted" keys to "seed" which Minions can be accepted (see below)
    //2) We want to use the "accepted" and "denied" keys to seed which Minions can be deleted/bounced (see below)
    router.get('/salt/minions/keys', function(req, res, next) {
        saltSvc.exec('salt-key', '--out=raw')
            .then(res.json.bind(res), next);
    });

    // List of current online minions, this list can be used for some of the functions below to make it more responsive
    // Should be used in the "logstash crashed" alert to see if any minions are online
    router.get('/salt/minions/online-status', function(req, res, next) {
        saltSvc.exec('salt-run', '--timeout=30','manage.status', '--out=json', '--no-color')
            .then(res.json.bind(res), next);
    });

    // Reboot a specifc minion (should use the List syntax, on online minions only)
    // Command: salt -L minion1,minion2 system.reboot --out=json (will probably not return)
    router.post('/salt/minion/:bbox/reboot', function (req, res, next) {
        validateBBoxParams(function(knownBBoxes) {
            return validate(req.params, schemas.bbox(knownBBoxes));
        }).then(function(params) {
            return saltSvc.exec('salt', '-L', params.bbox, 'system.reboot', '--out=json');
        }).then(res.json.bind(res), next);
    });

    // Accept a specific minions (should be listed as "unaccepted" by earlier command)
    // Command: salt-key --yes -a minion --out=json
    router.post('/salt/minion/:bbox/accept', function (req, res, next) {
        validateBBoxParams(function(knownBBoxes) {
            return validate(req.params, schemas.bbox(knownBBoxes));
        }).then(function(params) {
            return saltSvc.exec('salt-key', '--yes', '-a', params.bbox, '--out=json');
        }).then(res.json.bind(res), next);
    });

    // Delete a specific minion key (should be listed as "accepted" or "denied" by earlier command)
    // Command: salt-key --yes -d minion --out=json
    router.delete('/salt/minion/:bbox/key', function (req, res, next) {
        validateBBoxParams(function(knownBBoxes) {
            return validate(req.params, schemas.bbox(knownBBoxes));
        }).then(function(params) {
            return saltSvc.exec('salt-key', '--yes', '-d', params.bbox, '--out=json');
        }).then(res.json.bind(res), next);
    });

    //Trigger a configuration run on a specific (or list of) minions
    //Command: salt -L minion1,minion2 state.highstate --out=json
    router.post('/salt/minion/:bbox/trigger-highstate', function (req, res, next) {
        validateBBoxParams(function(knownBBoxes) {
            return validate(req.params, schemas.bbox(knownBBoxes));
        }).then(function(params) {
            return saltSvc.exec('salt', '-L', params.bbox, 'state.highstate', '--out=json');
        }).then(res.json.bind(res), next);
    });


    //Check if a highstate is currently running (on online minion(s))
    //Command: salt -L minion1,minion2 file.file_exists /tmp/highstate_running
    router.get('/salt/minion/:bbox/highstate-running', function (req, res, next) {
        validateBBoxParams(function(knownBBoxes) {
            return validate(req.params, schemas.bbox(knownBBoxes));
        }).then(function(params) {
            return saltSvc.exec('salt', '-L', params.bbox, 'file.file_exists', '/tmp/highstate_running', '--out=json');
        }).then(res.json.bind(res), next);
    });

    //Check if a minion needs a reboot (on online minion(s))
    //Command: salt -L minion1,minion2 file.file_exists /tmp/reboot_required
    router.get('/salt/minion/:bbox/reboot-required', function (req, res, next) {
        validateBBoxParams(function(knownBBoxes) {
            return validate(req.params, schemas.bbox(knownBBoxes));
        }).then(function(params) {
            return saltSvc.exec('salt', '-L', params.bbox, 'file.file_exists', '/tmp/reboot_required', '--out=json');
        }).then(res.json.bind(res), next);
    });

    function validateBBoxParams(validateCB) {
        return new Promise(function(resolve, reject) {
            sitesStore.getAllBBoxes(function(err, knownBBoxes) {
                if (err) {
                    return reject(err);
                }
                try {
                    var params = validateCB(knownBBoxes);
                    resolve(params);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    return router;
};