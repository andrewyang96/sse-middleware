function makeMiddleware(param) {
	return function (req, res, next) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    connections.push(res);
    res.on('close', function () {
      var idx = connections.indexOf(res);
      connections.splice(idx, 1);
    });
    next();
  };
};

modules.export = makeMiddleware;
