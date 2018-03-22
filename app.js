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
const test = require('./app/test');
const goldstar = require('./app/goldstar');

app.set('port', (process.env.PORT || 5000));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('static'));

app.get('/health', (req, res) => {
  res.send('good');
});

app.get('/goldstar', (req, res) => {
  goldstar(req, res);
});

app.get('/conditions', (req, res) => {
  skiConditions(res);
});

app.get('/kegbot', (req, res) => {
  kegBot(req, res);
});

app.get('/circle', (req, res) => {
  circle(res);
});

app.get('/pir', (req, res) => {
  pir(res);
});

app.get('/sprinkler', (req, res) => {
  sprinkler(req, res);
});

app.get('/date', (req, res) => {
  date(res);
});

app.get('/crypto', (req, res) => {
  crypto(req, res);
});

app.get('/test', (req, res) => {
  test(req, res);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
