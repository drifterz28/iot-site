const fs = require('fs');

module.exports = (req, res) => {
  const query = req.query;
  fs.readFile('kegs.json', 'utf8', (err, data) => {
    if (err) throw err;
    if(Object.keys(query).length !== 0) {
      let json = JSON.parse(data);
      if(['kegOne', 'kegTwo'].indexOf(query.keg) === -1) {
        res.status(403).send('{"error": "invalid param"}');
        return false;
      }
      if(query.name) {
        json[query.keg].name = query.name;
      }
      if(query.maxValue) {
        json[query.keg].maxValue = query.maxValue;
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
