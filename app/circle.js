const request = require('request');
const _ = require('lodash');
const requestUrl = 'https://circleci.com/api/v1.1/project/github/goldstar/goldstar?';
const ciToken = 'circle-token=4d88be7da3423ea99111cc549fd402ef680ff6b2&limit=';
const limit = 30;
const badStatus = ['not_run', 'canceled'];
const colorDefault = {
  r: '000',
  g: '000',
  b: '000'
}

const colors = {
  fixed: {g: '240'},
  success: {g: '240'},
  failed: {r: '240'},
  timedout: {r: '240'},
  running: {b: '240'},
  queued: {
    b: '211',
    r: '148'
  },
  scheduled: {
    b: '211',
    r: '148'
  },
  not_running: {
    b: '211',
    r: '148'
  },
  off: colorDefault
};

module.exports = (res) => {
  const d = new Date();
  const day = d.getDay();
  const hours = d.getHours();
  const isWeekEnd = day === 6 || day === 0;
  const isOffHours = hours < 10 || hours > 21;

  request({url: requestUrl + ciToken + limit, json: true}, function(error, response, json) {
    if(!error) {
      let buildStatus = _.find(json, (build) => {
        return build.user.login === 'drifterz28' && badStatus.indexOf(build.status) === -1;
      });
      if(!buildStatus || badStatus.indexOf(buildStatus.status) > 0) {
        buildStatus = _.find(json, (build) => {
          return badStatus.indexOf(build.status) === -1 && build.branch === 'master';
        });
      }
      if(isOffHours || isWeekEnd) {
        buildStatus.status = 'off';
      }
      const color = Object.assign({r:'000',g:'000',b:'000'}, colors[buildStatus.status]);
      let jsonOut = {
        s: buildStatus.status,
        t: d,
        n: buildStatus.committer_name
      }
      jsonOut = Object.assign(jsonOut, color);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(jsonOut));
    }
  });
};
