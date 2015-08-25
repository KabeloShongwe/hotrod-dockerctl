'use strict';

var _ = require('lodash');
var config = require('../../config');
var gitConfigDir = config.get('GIT_CONFIG_DIR');
var settingsConfigFilePath = gitConfigDir + '/sites.sls';
var readYamlObj = require('../bboxsettings').readYamlObj;

var testSitesJson = config.get('TEST_SITES');
var testSites;
if (testSitesJson) {
    console.log('Parsing test site JSON:', testSitesJson);
    testSites = JSON.parse(testSitesJson);
}

var store = {
    getAll: function(cb) {
        if (testSites) {
            console.log('Returning test sites:', testSites);
            return cb(null, testSites);
        }
        readYamlObj(settingsConfigFilePath, function (err, yamlAsObj) {
            if (err) {
                return cb(err);
            }
            var sites = yamlAsObj && yamlAsObj.Sites ? yamlAsObj.Sites : [];
            cb(null, sites);
        });
    },
    getAllBBoxes: function(cb) {
        this.getAll(function(err, sites) {
            if (err) {
                return cb(err);
            }
            var bboxes = _.map(sites, function(site) {
                return site.bbox;
            });
            cb(null, bboxes);
        });
    },
    getBySiteName: function(siteName, cb) {
        this.getAll(function(err, sites) {
            if (err) {
                return cb(err);
            }
            var site = _.find(sites, { 'name': siteName });
            cb(null, site);
        });
    },
    getByBBox: function(bboxId, cb) {
        this.getAll(function(err, sites) {
            if (err) {
                return cb(err);
            }
            var site = _.find(sites, { 'bbox': bboxId });
            cb(null, site);
        });
    }
};

module.exports = store;