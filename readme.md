# Mock NATS client

Runs a mocked, in-memory version of NATS which comes in handy when writing
tests that evolves around publishing and subscribing to message using NATS node client.

## Usage

    npm install mock-nats-client --save-dev


Use same way as NATS node client. 

## Support

* Basic subscribe (limited support for subscribe options)
* Basic unsubscribe
* Publish
* Queue groups
* Timeout

On the roadmap:

* Request
* ...you name it!