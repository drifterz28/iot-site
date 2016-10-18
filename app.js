const fs = require('fs');
const env = process.env;
const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

const skiConditions = require('./app/ski-conditions');
const kegBot = require('./app/kegbot');

app.use(express.static('static'));

app.get('/health', function(req, res) {
  res.send('good');
});

app.get('/conditions', function(req, res) {
  skiConditions(res);
});

app.get('/kegbot', function(req, res) {
  kegBot(res);
});

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost')
console.log('Magic happens on port 3000');
exports = module.exports = app;
