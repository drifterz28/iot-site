
module.exports = (req, res) => {
  const query = req.query;
  console.log(query)
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(query));
};
