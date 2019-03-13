const fs = require('fs');
const env = process.env;
const express = require('express');
const Bundler = require('parcel-bundler');
const app = express();

const skiConditions = require('./app/ski-conditions');
const pir = require('./app/pir');
const sprinkler = require('./app/sprinkler');
const date = require('./app/date');
const crypto = require('./app/crypto');
const test = require('./app/test');
const goldstar = require('./app/goldstar');
const bundler = new Bundler('./src/index.html');
const port = process.env.PORT || 5000;
app.set('port', port);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use(express.static('dist'));

app.get('/health', (req, res) => {
  res.send('good');
});

app.get('/goldstar', (req, res) => {
  goldstar(req, res);
});

app.get('/conditions', (req, res) => {
  skiConditions(res);
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

app.use(bundler.middleware());

app.listen(port, () => {
  console.log(`Node app is running on http://0.0.0.0:${port}`);
});
