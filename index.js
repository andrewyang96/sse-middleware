var makeMiddleware = require('./make-middleware');

var SSE = {};

SSE.prototype.makeSource = function (paramName) {
  function EventEmitter(paramName) {
    this.paramName = paramName;
    if (typeof this.paramName === 'string') {
      this.connections = {};
    } else {
      this.connections = [];
    }
  }

  EventEmitter.prototype.addConnection = function (req, res) {
    if (typeof this.paramName === 'string') {
      req.params[this.paramName]
      if (param) {
        try {
          this.connections[param].push(res);
        } catch (TypeError) {
          this.connections[param] = [res];
        }
      } else {
        // TODO: emit error
      }
    } else {
      this.connections.push(res);
    }
  };

  EventEmitter.prototype.removeConnection = function (req, res) {
    if (typeof this.paramName === 'string') {
      var param = req.params[this.paramName];
      if (param) {
        var idx = this.connections[param].indexOf(res);
        this.connections[param].splice(idx, 1);
      } else {
        // TODO: emit error
      }
    } else {
      var idx = connections.indexOf(res);
      connections.splice(idx, 1);
    }
  };

  EventEmitter.prototype.sendData = function (req, data) {
    // TODO: implement
  }

  return makeMiddleware(paramName).bind(this);
};

modules.export = SSE;
