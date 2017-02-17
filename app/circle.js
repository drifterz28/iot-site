const request = require('request');
const _ = require('lodash');
const requestUrl = 'https://circleci.com/api/v1.1/project/github/goldstar/goldstar?';
const ciToken = 'circle-token=4d88be7da3423ea99111cc549fd402ef680ff6b2&limit=';
const limit = 30;
const d = new Date();
const day = d.getDay();
const hours = d.getHours();
const isWeekEnd = day === 6 || day === 0;
const isOffHours = hours < 10 || hours > 21;

module.exports = (res) => {
  request({url: requestUrl + ciToken + limit, json: true}, function(error, response, json) {
    if(!error) {
      let buildStatus = _.find(json, (build) => {
        return build.user.login === 'drifterz28';
      });
      if(!buildStatus || buildStatus.status === 'canceled' || buildStatus.status === 'not_run') {
        buildStatus = json[0];
      }
      if(isOffHours || isWeekEnd) {
        //buildStatus.status = 'off';
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(`{"status": "${buildStatus.status}", "dayOfTheWeek": "${day}", "hoursOfDay": "${hours}"}`);
    }
  });
};
