const request = require('request');


const dateAdapter = upcoming_shows => upcoming_shows[0].date + ' - ' + upcoming_shows.pop().date;

const listingsAdapter = (listing) => {
  console.log(listing._embedded.upcoming_shows)
  return {
    title: listing.title_as_text,
    price: listing.our_price,
    dateRange: dateAdapter(listing._embedded.upcoming_shows)
  }
};

module.exports = (req, res) => {
  const query = req.query;
  const url = `https://www.goldstar.com/${query.location}.hal`;
  const max = +query.max || 20;
  request({url: url, json: true}, (error, response, json) => {
    if(!error) {
      const listings = json._embedded.listings.slice(0, max);
      const cleanListings = listings.map(listing => listingsAdapter(listing));
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(cleanListings));
    }
  });
};
