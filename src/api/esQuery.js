var EsQuery = require('hotrod-dash-data/lib/query/es/esQuery');
var EsQueryRunner = require('hotrod-dash-data/lib/query/es/esQueryRunner');
var esClient = require('./elasticsearch');
var queryRunner = new EsQueryRunner(esClient);

module.exports = new EsQuery(queryRunner, {
    queryDefaults: {
        type: 'events',
        searchType: 'count'
    }
});