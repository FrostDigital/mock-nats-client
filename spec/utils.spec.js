const utils = require("../lib/utils");

describe("Utils", () => {

	it("should match >", () => {
		expect(utils.matchSubject("foo.bar", ">")).toBeTruthy();	
	});

	it("should match foo.* ", () => {
		expect(utils.matchSubject("foo.bar", "foo.*")).toBeTruthy();	
		expect(utils.matchSubject("foo.bar.baz", "foo.*")).toBeFalsy();	
	});

	it("should match foo.*.baz ", () => {
		expect(utils.matchSubject("foo.bar.baz", "foo.*.baz")).toBeTruthy();	
		expect(utils.matchSubject("foo.bar.baz.poo", "foo.*.baz")).toBeFalsy();	
	});

	it("should match foo.> ", () => {
		expect(utils.matchSubject("foo.bar.baz", "foo.>")).toBeTruthy();	
		expect(utils.matchSubject("foo.bar.baz.poo", "foo.>")).toBeTruthy();	
		expect(utils.matchSubject("foo", "foo.>")).toBeFalsy();	
	});
	
});