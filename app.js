const fs = require('fs');
const env = process.env;
const express = require('express');
const app = express();

const skiConditions = require('./app/ski-conditions');
const kegBot = require('./app/kegbot');
const circle = require('./app/circle');
const pir = require('./app/pir');
const sprinkler = require('./app/sprinkler');
const date = require('./app/date');
const crypto = require('./app/crypto');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('static'));

app.get('/health', function(req, res) {
  res.send('good');
});

app.get('/conditions', function(req, res) {
  skiConditions(res);
});

app.get('/kegbot', function(req, res) {
  kegBot(req, res);
});

app.get('/circle', function(req, res) {
  circle(res);
});

app.get('/pir', function(req, res) {
  pir(res);
});

app.get('/sprinkler', function(req, res) {
  sprinkler(req, res);
});

app.get('/date', function(req, res) {
  date(res);
});

app.get('/crypto', function(req, res) {
  crypto(req, res);
});

app.listen(env.NODE_PORT || 8888, env.NODE_IP || 'localhost')
console.log('Magic happens on port 8888');
exports = module.exports = app;
