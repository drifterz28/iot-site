const cheerio = require('cheerio');
const request = require('request');

module.exports = () => {
  const url = 'https://www.timberlinelodge.com/conditions';
  request(url, function(error, response, html) {
    if(!error) {
      const $ = cheerio.load(html);
      const $data = $('.conditions-panels');
      const $conditions = $data.find('i.weather-icon');
      let json = {
        conditions: {}
      };
      console.log('test')
      json['temperature'] = $data.find('.temp strong').text();
      json['datetime'] = 'NA';
      json['conditions'].icon = $conditions.attr('class').replace('weather-icon', '').replace('wi', '').trim();
      json['conditions'].text = $conditions.attr('title');
      json['windspeed'] = $('.windspeed').eq(0).text();
      json['snowdepth'] = $('.snowdepth-base').text().trim();

      $('.conditions-snowfall dl').each(function(i, elem) {
        json[$(elem).find('.metric').text()] = $(elem).find('.depth').text();
      });
      console.log(json);
      return json;
    }
  });
};
