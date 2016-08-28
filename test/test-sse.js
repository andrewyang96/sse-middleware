var assert = require('assert');
var SSE = require('../');
var Response = require('./lib/mock-res');

describe('SSE', function () {
  var sse;

  before(function () {
    sse = new SSE();
  });

	describe('#middleware', function () {
    it('should properly handle requests and responses', function () {
      var middlewareFunc = sse.middleware.bind(sse);
      var res = new Response();
      var nextWasCalled = false;
      middlewareFunc('req', res, function () {
        nextWasCalled = true;
      });
      assert.ok(true, nextWasCalled);
      assert.equal(200, res.statusCode);
      assert.equal('text/event-stream', res.headers['Content-Type']);
      assert.equal('no-cache', res.headers['Cache-Control']);
      assert.equal('keep-alive', res.headers['Connection']);
      assert.notEqual(-1, sse.connections.indexOf(res));

      res.sendData('hello world');
      assert.equal('data: hello world\n\n', res.lastWritten);

      var obj = {
        'json': true,
        'answer': 42
      };
      res.sendJSON(obj);
      assert.equal('data: ' + JSON.stringify(obj) + '\n\n', res.lastWritten);

      res.eventEmitter.emit('close');
      assert.equal(-1, sse.connections.indexOf(res));
    });
  });
});
