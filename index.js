const MockNatsClient = require("./lib/MockNatsClient");

module.exports.connect = (opts) => {
	const client = new MockNatsClient(opts);
	client.connect(opts);
	return client;
};
