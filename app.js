//const http = require('http');
const fs = require('fs');
const path = require('path');
const contentTypes = require('./utils/content-types');
const sysInfo = require('./utils/sys-info');
const env = process.env;

var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

// let server = http.createServer(function (req, res) {
//   let url = req.url;
//   if (url == '/') {
//     url += 'index.html';
//   }

  // IMPORTANT: Your application HAS to respond to GET /health with status 200
  //            for OpenShift health monitoring

//   if (url == '/health') {
//     res.writeHead(200);
//     res.end();
//   } else if (url == '/info/gen' || url == '/info/poll') {
//     res.setHeader('Content-Type', 'application/json');
//     res.setHeader('Cache-Control', 'no-cache, no-store');
//     res.end(JSON.stringify(sysInfo[url.slice(6)]()));
//   } else {
//     fs.readFile('./static' + url, function (err, data) {
//       if (err) {
//         res.writeHead(404);
//         res.end('Not found');
//       } else {
//         let ext = path.extname(url).slice(1);
//         res.setHeader('Content-Type', contentTypes[ext]);
//         if (ext === 'html') {
//           res.setHeader('Cache-Control', 'no-cache, no-store');
//         }
//         res.end(data);
//       }
//     });
//   }
// });
//
// server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
//   console.log(`Application worker ${process.pid} started...`);
// });

app.use(express.static('static'));

app.get('/health', function(req, res) {
  res.send('good');
});

app.get('/conditions', function(req, res) {
  var url = 'https://www.skihood.com/the-mountain/conditions';
  request(url, function(error, response, html) {
    if(!error) {
      var $ = cheerio.load(html);
      var $data = $('.conditions-glance');
      var $current = $data.find('.conditions-current');
      var $conditions = $current.find('.conditions');
      var json = {
        conditions: {}
      };

      json['temperature'] = $current.find('.temperature').text();
      json['datetime'] = $current.find('time').attr('datetime');
      json['conditions'].icon = $conditions.data('conditions');
      json['conditions'].text = $conditions.text();
      json['windspeed'] = $('.windspeed').eq(0).text();
      json['snowdepth'] = $('.snowdepth-base').text().trim();

      $('.conditions-snowfall dl').each(function(i, elem) {
        json[$(elem).find('.metric').text()] = $(elem).find('.depth').text();
      });
      console.dir(json);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(json));
    }
  });
});

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost')
console.log('Magic happens on port 3000');
exports = module.exports = app;
