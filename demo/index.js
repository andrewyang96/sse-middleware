var express = require('express');
var SSE = require('sse-middleware');
var uuid = require('node-uuid');

var app = express();
app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
});

/* Routes */
var randNumSSE = new SSE();
app.get('/randnum', randNumSSE.middleware.bind(randNumSSE), function (req, res) {
  res.sendData(randNum);
  console.log('Connected to random number endpoint');
});

var randUUIDSSE = new SSE();
app.get('/randuuid', randUUIDSSE.middleware.bind(randUUIDSSE), function (req, res) {
  res.sendData(randUUID);
  console.log('Connected to random UUID endpoint');
});

/* Random value generation */
var generateRandomDelay = function () {
  var delay = Math.floor(Math.random() * 3001) + 500;
  // console.log('Generated delay of', delay);
  return delay;
};

var generateRandomNumber = function () {
  return Math.ceil(Math.random() * 100);
};
var randNum = generateRandomNumber();
var updateRandomNumber = function () {
  randNum = generateRandomNumber();
  // console.log('Updated number to', randNum);
  randNumSSE.sendData(randNum);
  setTimeout(updateRandomNumber, generateRandomDelay());
};
setTimeout(updateRandomNumber, generateRandomDelay());

var generateRandomUUID = function () {
  return uuid.v4();
};
var randUUID = generateRandomUUID();
var updateRandomUUID = function () {
  randUUID = generateRandomUUID();
  // console.log('Updated UUID to', randUUID);
  randUUIDSSE.sendData(randUUID);
  setTimeout(updateRandomUUID, generateRandomDelay());
};
setTimeout(updateRandomUUID, generateRandomDelay);

/* Initialize server */
app.listen(3000, function () {
  console.log('Listening on port 3000');
});
