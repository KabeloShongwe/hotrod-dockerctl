var es = require('hotrod-dash-data').es;
var TraceFileSaver = require('hotrod-dash-data').TraceFileSaver;
var esClient = require('./elasticsearch');
var config = require('../config');
var path = require('path');
var moment = require('moment');

var savedQueriesDir = config.get('ES_SAVED_QUERIES_DIR');
// Make savedQueriesDir relative to index.js:
savedQueriesDir = savedQueriesDir ? path.join(__dirname, '../', savedQueriesDir) : null;

var traceFileSaver = new TraceFileSaver(savedQueriesDir, '%s-Q%s-%s%s', {
    enabled: config.getRequired('ES_SAVE_QUERIES'),
    fileNameFilter: config.get('ES_SAVE_QUERY_FILE_FILTER')
});

var queryRunner = new es.QueryRunner(esClient, {
    beforeQuery: function(search, query, queryNum) {
        traceFileSaver.save(search.body, ts(), leftPad(queryNum), 'REQ', makeFileFriendlyRoute(query.tag));
    },
    afterQuery: function(resp, query, queryNum) {
        traceFileSaver.save(resp, ts(), leftPad(queryNum), 'RES', makeFileFriendlyRoute(query.tag));
    }
});

function ts() {
    return moment().format('HHmm');
    // return moment().format('YYYYMMDD_HHmmss');
}
function leftPad(queryNum) {
    return ('000' + queryNum).slice(-3);
}
function makeFileFriendlyRoute(routePath) {
    // replacing chars from route paths like  "/foo/:bar" so we can make a valid filename
    return routePath
        .replace(/\//g, '--')
        .replace(/:/g, 'P-');
}

module.exports = new es.Query(queryRunner, {
    queryDefaults: {
        type: 'events',
        searchType: 'count'
    }
});