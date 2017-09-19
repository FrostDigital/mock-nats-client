# Mock NATS client

Runs a mocked, in-memory version of NATS which comes in handy when writing
tests that evolves around publishing and subscribing to messages using the [node NATS client](https://github.com/nats-io/node-nats).

This mocked NATS client exposes same API as Node NATS Client but instead of connecting to a NATS
bus it will publish and subscribe in memory.

## Usage

    npm install mock-nats-client --save-dev

Use NATS node client as-is now, but instead of importing (or requiring) `nats`, import `mock-nats-client`.

## Support

* Basic subscribe (limited support for subscribe options)
* Basic unsubscribe
* Publish
* Queue groups
* Timeout

On the roadmap:

* Request
* Auto unsubscribe
* Max wanted
* ...you name it!
