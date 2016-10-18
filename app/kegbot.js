var MongoClient = require('mongodb').MongoClient;

module.exports = (res) => {
  var connection_string = '';
  if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({"hello": connection_string}));
};
