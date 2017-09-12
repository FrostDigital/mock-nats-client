const uuid = require("uuid");
const utils = require("./utils");
const EventEmitter = require("events");

class MockNatsClient extends EventEmitter {

	constructor() {
		super();
		this.subs = [];
	}

	/**
	 * Mock connect. Will not do anything except from
	 * setting property `connected` to true.
	 *
	 * Emits `connect` event.
	 * 	
	 * @param  {object} opts
	 */
	connect(opts) {
		this.connected = true;

		setTimeout(() => {
			this.emit("connect");
		}, 10);
	}

	/**
	 * Mock close. Will empty subscriptions and set `connected` to false.	 
	 */
	close() {
		this.subs = [];
		this.connected = false;
	}

	/**
	 * Subscribe to subject.
	 *
	 * TODO: Add support for subscribe options
	 * 
	 * @param  {string}   subject       subject to subscribe to
	 * @param  {object}   subscribeOpts options
	 * @param  {Function} cb            
	 * @return {string}                 subject id (sid)
	 */
	subscribe(subject, subscribeOpts, cb /* (msg, replyTo, subject) */) {
		const sid = uuid.v4();

		this.subs.push({
			subject: subject,
			opts: subscribeOpts,
			cb: cb,
			sid: sid,
			received: 0
		});

		return sid;
	}
	
	/**
	 * Publish message to subject.
	 * 
	 * @param  {string} subject
	 * @param  {string} message
	 * @param  {string} replyTo subject	 
	 */
	publish(subject, message, replyTo) {
		const sub = this._findSubscribeBySubject(subject);

		if (sub) {
			sub.received++;

			if (sub.timeout && sub.received >= sub.expected) {
				clearTimeout(sub.timeout);
				sub.timeout = null;
			}

			sub.cb(message, replyTo, subject);			
		} else {
			throw "Missing subscription " + subject;
		}
	}

	/**
	 * Remove existing subscription by sid.
	 * 
	 * @param  {string} sid 	 
	 */
	unsubscribe(sid) {
		// TODO: Add support for auto-unsubscribe after MAX_WANTED messages received		
		const subToRemove = this._findSubscribeBySid(sid);

		if (subToRemove) {			
			this.subs.splice(this.subs.indexOf(subToRemove), 1);
		}		
	}
	
	/**
	 * Invoke timeout callback if subscription has not received
	 * expected number of message during given timeout (ms).
	 * 
	 * @param  {string}   sid     
	 * @param  {number}   timeout  in ms
	 * @param  {number}   expected number of messages to receive
	 * @param  {Function} cb 	 
	 */
	timeout(sid, timeout, expected, cb = () => {}) {
		let sub = this._findSubscribeBySid(sid);

		if (sub) {
			sub.expected = expected;				
			sub.timeout = setTimeout(() => {
				cb(sid);
			}, timeout);			
		}
	}

	_findSubscribeBySubject(subject) {		
		return this.subs.find(sub => utils.matchSubject(subject, sub.subject));
	}

	_findSubscribeBySid(sid) {
		return this.subs.find(sub => sub.sid === sid);
	}
}

module.exports = MockNatsClient;