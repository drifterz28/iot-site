const cheerio = require('cheerio');
const request = require('request');

module.exports = res => {
  const url = 'https://www.skihood.com/the-mountain/conditions';
  request(url, function(error, response, html) {
    if (!error) {
      const $ = cheerio.load(html);
      const $data = $('.conditions-glance');
      const $current = $data.find('.conditions-current');
      const $conditions = $current.find('.conditions');
      const date = new Date($current.find('time').attr('datetime')).toString();
      const json = {
        location: 'Mt Hood Meadows',
        temperature: $current.find('.temperature').text(),
        datetime: date,
        conditions: {
          icon: $conditions.data('conditions'),
          text: $conditions.text()
        },
        windspeed: $('.windspeed').eq(0).text(),
        snowdepth: $('.snowdepth-base').text().trim()
      };

      $('.conditions-snowfall dl').each(function(i, elem) {
        json[$(elem).find('.metric').text()] = $(elem).find('.depth').text();
      });
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(json));
    }
  });
};
