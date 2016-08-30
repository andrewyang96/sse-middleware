'use strict';

var assert = require('assert');
var SSE = require('../');
var Response = require('./lib/mock-res');

describe('SSE', () => {
  let sse;
  let res;

  before(() => {
    sse = new SSE();
    res = new Response();
  });

  describe('#middleware', () => {
    it('should add response to connection list in response handler', done => {
      const middlewareFunc = sse.middleware.bind(sse);
      let nextWasCalled = false;
      middlewareFunc('req', res, () => {
        nextWasCalled = true;
      });
      assert.ok(true, nextWasCalled);
      assert.equal(200, res.statusCode);
      assert.equal('text/event-stream', res.headers['Content-Type']);
      assert.equal('no-cache', res.headers['Cache-Control']);
      assert.equal('keep-alive', res.headers['Connection']);
      assert.notEqual(-1, sse.connections.indexOf(res));
      done();
    });

    it('should send plain data through response', done => {
      res.sendData('hello world');
      assert.equal('data: hello world\n\n', res.lastWritten);
      done();
    });

    it('should send JSON data through response', done => {
      const obj = {
        'json': true,
        'answer': 42
      };
      res.sendJSON(obj);
      assert.equal(`data: ${JSON.stringify(obj)}\n\n`, res.lastWritten);
      done();
    });

    it('should remove response from connection list once connection is closed', done => {
      res.eventEmitter.emit('close');
      assert.equal(-1, sse.connections.indexOf(res));
      done();
    });
  });
});
