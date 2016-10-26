const fs = require('fs');

module.exports = (req, res) => {
  const query = req.query;
  fs.readFile('kegs.json', 'utf8', (err, data) => {
    if (err) throw err;
    if(Object.keys(query).length !== 0) {
      let json = JSON.parse(data);
      if(['kegOne', 'kegTwo'].indexOf(query.keg) === -1 && !query.json) {
        res.status(403).send('{"error": "invalid param"}');
        return false;
      }
      if(query.json) {
        // need to get json data
        /*
        {
          fan: 1,
          temp: 52.34,
          humidity: 51.8,
          kegOne: 556.92,
          kegTwo: 18.48
          }
        */
        const queryJson = JSON.parse(query.json);
        json.kegOne.value = queryJson.kegOne;
        json.kegTwo.value = queryJson.kegTwo;
        json.fan = queryJson.fan;
        json.temp = queryJson.temp;
        json.humidity = queryJson.humidity;
      }
      if(query.name) {
        json[query.keg].name = query.name;
      }
      if(query.maxValue) {
        json[query.keg].maxValue = query.maxValue;
      }
      if(query.gallons) {
        json[query.keg].gallons = query.gallons;
      }
      fs.writeFileSync('kegs.json', JSON.stringify(json), 'utf8');
    }
    // read values from saved file to confirm save
    fs.readFile('kegs.json', 'utf8', (err, data) => {
      if (err) throw err;
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    });
  });
};
