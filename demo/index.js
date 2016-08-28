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

var randMultiplesSSE = new SSE('num');
app.get('/randmultiples/:num', randMultiplesSSE.middleware.bind(randMultiplesSSE), function (req, res, next) {
  if (['2', '3', '4', '5', '6', '7', '8', '9'].indexOf(req.params.num) === -1) {
    next();
  }
  res.sendData(randMultiples[Number.parseInt(req.params.num)]);
  console.log('Connected to random multiple endpoint: ', req.params.num);
});

/* Random value generation */
var generateRandomDelay = function () {
  var delay = Math.floor(Math.random() * 3001) + 500;
  console.log('Generated delay of', delay);
  return delay;
};

var generateRandomNumber = function () {
  return Math.ceil(Math.random() * 100);
};
var randNum = generateRandomNumber();
var updateRandomNumber = function () {
  randNum = generateRandomNumber();
  console.log('Updated number to', randNum);
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
  console.log('Updated UUID to', randUUID);
  randUUIDSSE.sendData(randUUID);
  setTimeout(updateRandomUUID, generateRandomDelay());
};
setTimeout(updateRandomUUID, generateRandomDelay);

var generateRandomMultiple = function (num) {
  return Math.ceil(Math.random() * 10) * num;
};
var randMultiples = {};
var updateMultiple = function (num) {
  randMultiples[num] = generateRandomMultiple(num);
  console.log('Updated multiple', num, 'to', randMultiples[num]);
  randMultiplesSSE.sendData(randMultiples[num], num);
  setTimeout(function () {
    updateMultiple(num);
  }, generateRandomDelay());
};
var populateMultiples = function () {
  for (var i = 2; i <= 9; i++) {
    randMultiples[i] = updateMultiple(i);
  }
};
populateMultiples();

/* Initialize server */
app.listen(3000, function () {
  console.log('Listening on port 3000');
});
