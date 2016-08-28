function SSE() {
  this.connections = [];
};

SSE.prototype._addConnection = function (res) {
  this.connections.push(res);
};

SSE.prototype._removeConnection = function (res) {
  var idx = this.connections.indexOf(res);
  this.connections.splice(idx, 1);
};

SSE.prototype.middleware = function (req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  this._addConnection(res);
  res.once('close', function () {
    this._removeConnection(res);
  }.bind(this));

  res.sendData = function (data) {
    res.write('data: ' + data + '\n\n');
  };

  res.sendJSON = function (data) {
    return res.sendData(JSON.stringify(data));
  };

  next();
};

SSE.prototype.sendData = function (data) {
  for (var i = 0; i < this.connections.length; i++) {
    this.connections[i].sendData(data);
  }
};

SSE.prototype.sendJSON = function (data) {
  this.sendData(JSON.stringify(data));
};

module.exports = SSE;
