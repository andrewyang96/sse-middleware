'use strict';

class SSE {
  constructor() {
    this.connections = [];
  }

  _addConnection(res) {
    this.connections.push(res);
  }

  _removeConnection(res) {
    const idx = this.connections.indexOf(res);
    this.connections.splice(idx, 1);
  }

  middleware(req, res, next) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    this._addConnection(res);
    res.once('close', () => {
      this._removeConnection(res);
    });

    res.sendData = data => {
      res.write(`data: ${data}\n\n`);
    };

    res.sendJSON = data => res.sendData(JSON.stringify(data));

    next();
  }

  sendData(data) {
    for (let i = 0; i < this.connections.length; i++) {
      this.connections[i].sendData(data);
    }
  }

  sendJSON(data) {
    this.sendData(JSON.stringify(data));
  }
}

module.exports = SSE;
