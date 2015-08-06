var logger = require('hotrod-logger')('event-writer');

function EventWriter(esClient, index, type) {
    this.esClient = esClient;
    this.index = index;
    this.type = type;
}

EventWriter.prototype.write = function(eventId, event) {
    logger.trace('Writing event ID:', eventId);
    return this.esClient.update({
        id: eventId,
        index: this.index,
        type: this.type,
        body: {
            doc: event,
            doc_as_upsert: true
        }
    });
};

module.exports = EventWriter;