var logger = require('hotrod-logger')('event-writer');
var moment = require('moment');

function EventWriter(esClient, index, indexDateSuffix, type) {
    this.esClient = esClient;
    this.index = index;
    this.indexDateSuffix = indexDateSuffix;
    this.type = type;
}

EventWriter.prototype.write = function(eventId, event) {
    var index = this.indexDateSuffix
        ? this.index + moment.utc().format(this.indexDateSuffix)
        : this.index;

    logger.trace('Writing event ID:', eventId, 'to index:', index, 'type:', this.type);

    return this.esClient.update({
        id: eventId,
        index: index,
        type: this.type,
        body: {
            doc: event,
            doc_as_upsert: true
        }
    });
};

module.exports = EventWriter;