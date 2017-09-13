# Mock NATS client

Runs a mocked, in-memory version of NATS which comes in handy when writing
tests that evolves around publishing and subscribing to message using NATS node client.

## Usage

    npm install mock-nats-client --save-dev


Use same way as NATS node client. 

## Support

* Basic subscribe (subscribe options cannot be set at this time) 
* Basic unsubscribe
* Publish
* Timeout

On the roadmap:

* Request
* Queue groups
* Max awai
