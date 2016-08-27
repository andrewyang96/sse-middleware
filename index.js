function SSE(paramName) {
  this.paramName = paramName;
  if (typeof this.paramName === 'string') {
    this.connections = {};
  } else {
    this.connections = [];
  }
};

SSE.prototype._addConnection = function (req, res) {
  if (typeof this.paramName === 'string') {
    var param = req.params[this.paramName];
    if (param) {
      try {
        this.connections[param].push(res);
      } catch (TypeError) {
        this.connections[param] = [res];
      }
    } else {
      console.log(this.paramName, 'not found in request params');
    }
  } else {
    this.connections.push(res);
  }
};

SSE.prototype._removeConnection = function (req, res) {
  if (typeof this.paramName === 'string') {
    var param = req.params[this.paramName];
    if (param) {
      var idx = this.connections[param].indexOf(res);
      this.connections[param].splice(idx, 1);
    } else {
      console.log(this.paramName, 'not found in request params');
    }
  } else {
    var idx = this.connections.indexOf(res);
    this.connections.splice(idx, 1);
  }
};

SSE.prototype.middleware = function (req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  this._addConnection(req, res);
  res.once('close', function () {
    this._removeConnection(req, res);
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
  if (typeof this.paramName === 'string') {
    var param = req.params[this.paramName];
    if (param) {
      for (var i = 0; i < this.connections[param].length; i++) {
        this.connections[param][i].sendData(data);
      }
    } else {
      console.log(this.paramName, 'not found in request params');
    }
  } else {
    for (var i = 0; i < this.connections.length; i++) {
      this.connections[i].sendData(data);
    }
  }
};

SSE.prototype.sendJSON = function (data) {
  this.sendData(JSON.stringify(data));
};

module.exports = SSE;
