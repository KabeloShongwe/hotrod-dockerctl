'use strict';

var express = require('express');
var router = express.Router();
var validate = require('input-validator');
var Joi = require('joi');
var uuid = require('node-uuid');
var esClient = require('../../elasticsearch');
var config = require('../../../config');
var eventWriterIndex = config.getRequired('EVENT_WRITER_INDEX');
var eventWriterIndexSuffix = config.get('EVENT_WRITER_INDEX_DATE_SUFFIX');
var eventWriterType = config.get('EVENT_WRITER_TYPE');

var EventWriter = require('./eventWriter');
var eventWriter = new EventWriter(esClient, eventWriterIndex, eventWriterIndexSuffix, eventWriterType);

var eventSchemas = {
    eventId: Joi.object().keys({
        id: Joi.string().required()
    }),
    event: Joi.object().required()
};

module.exports = function() {

    router.post('/events', function (req, res, next) {
        var event = validate(req.body, eventSchemas.event);
        var id = uuid.v4();
        writeEvent(id, event, res, next);
    });

    router.post('/events/:id', function (req, res, next) {
        var params = validate(req.params, eventSchemas.eventId);
        var event = validate(req.body, eventSchemas.event);
        writeEvent(params.id, event, res, next);
    });

    function writeEvent(id, event, res, next) {
        eventWriter.write(id, event).then(function() {
            res.status(201).send(id);
        }, next);
    }

    return router;
};
