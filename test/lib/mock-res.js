var events = require('events');

function Response() {
  this.statusCode = null;
  this.headers = null;
  this.lastWritten = null;
  this.eventEmitter = new events.EventEmitter();
};

Response.prototype.writeHead = function (statusCode, headers) {
  this.statusCode = statusCode;
  this.headers = headers;
};

Response.prototype.once = function (eventName, callback) {
	this.eventEmitter.once(eventName, callback);
};

Response.prototype.write = function (data) {
  this.lastWritten = data;
};

module.exports = Response;
