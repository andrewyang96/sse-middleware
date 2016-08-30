'use strict';

var events = require('events');

class Response {
  constructor() {
    this.statusCode = null;
    this.headers = null;
    this.lastWritten = null;
    this.eventEmitter = new events.EventEmitter();
  }

  writeHead(statusCode, headers) {
    this.statusCode = statusCode;
    this.headers = headers;
  }

  once(eventName, callback) {
      this.eventEmitter.once(eventName, callback);
  }

  write(data) {
    this.lastWritten = data;
  }
}

module.exports = Response;
