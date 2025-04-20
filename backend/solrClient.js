const solr = require("solr-client");

const solrClient = solr.createClient({
	host: "localhost",
	port: "8983",
	core: "metadatacore",
	path: "/solr"
});

module.exports = solrClient;