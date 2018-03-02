const MockNatsClient = require("../lib/MockNatsClient");

describe("MockNatsClient", () => {

	let client;

	beforeEach(() => {
		client = new MockNatsClient();
	});

	it("should connect and close", (done) => {
		client.on("connect", () => {
			expect(client.connected).toBe(true);
			client.close();
			expect(client.connected).toBe(false);
			done();
		});

		client.connect();
	});

	it("should emit 'disconnect' event on close", (done) => {
		client.on("connect", () => {
			expect(client.connected).toBe(true);
			client.close();
		});

		client.on("disconnect", () => {
			expect(client.connected).toBe(false);
			done();
		});

		client.connect();
	});

	it("should subscribe and publish to 'foo'", (done) => {
		client.subscribe("foo", {}, (msg, replyTo, actualSubject) => {
			expect(msg).toBe("message");
			expect(replyTo).toBe("replyTo");
			expect(actualSubject).toBe("foo");
			done();
		});

		client.publish("foo", "message", "replyTo");
	});

	it("should subscribe and publish to 'foo.*'", (done) => {
		client.subscribe("foo.*", {}, (msg, replyTo, actualSubject) => {
			expect(msg).toBe("message");
			expect(replyTo).toBe("replyTo");
			expect(actualSubject).toBe("foo.bar");
			done();
		});

		client.publish("foo.bar", "message", "replyTo");
	});

	it("should subscribe and publish to 'foo.>'", (done) => {
		client.subscribe("foo.>", {}, (msg, replyTo, actualSubject) => {
			expect(msg).toBe("message");
			expect(replyTo).toBe("replyTo");
			expect(actualSubject).toBe("foo.bar.baz");
			done();
		});

		client.publish("foo.bar.baz", "message", "replyTo");
	});

	it("should unsubscribe", () => {
		const sid = client.subscribe("foo", {}, (msg, replyTo, actualSubject) => {});

		expect(sid).toBeDefined();
		expect(client.subs.length).toBe(1);

		client.unsubscribe(sid);
		expect(client.subs.length).toBe(0);
	});

	it("should timeout", (done) => {

		const sid = client.subscribe("foo", {}, (msg, replyTo, actualSubject) => {});

		client.timeout(sid, 100, 1, (oSid) => {
			expect(oSid).toBe(sid);
			done();
		});

	});

	it("should not timeout if receiving expected num of messages", (done) => {

		const sid = client.subscribe("foo", {}, (msg, replyTo, actualSubject) => {});

		client.timeout(sid, 100, 2, (oSid) => {
			done.fail();
		});

		client.publish("foo", "message");
		client.publish("foo", "message");

		setTimeout(() => {
			done();
		}, 200);
	});

	it("should publish to one in each queue group plus subscription wo any queue", (done) => {
		let numInvocations = 0;
		function count() {
			numInvocations++;
		}

		client.subscribe("foo", { queue: "q1" }, count);
		client.subscribe("foo", { queue: "q1" }, count);
		client.subscribe("foo", { queue: "q2" }, count);
		client.subscribe("foo", { queue: "q2" }, count);
		client.subscribe("foo", {}, count);

		client.publish("foo", "message");

		setTimeout(() => {
			expect(numInvocations).toBe(3);
			done();
		}, 200);
	});

});
