const Client = require('coinbase').Client;
const client = new Client({
  'apiKey': 'RjDJ0V8bcNI4l0iI',
  'apiSecret': 'cLm2Bn7OS8JWFbhvcTMrHKwgPOKlO4iq'
});

const accountKey = '0faa363f-e813-5d80-a023-8d547b5da43d';
let currencyIndex = 0;
const currency = [
  {
    currencyPair: 'BTC-USD',
    name: 'Bitcoin',
    lastPrice: 0
  }, {
    currencyPair: 'ETH-USD',
    name: 'Ethereum',
    lastPrice: 0
  }, {
    currencyPair: 'LTC-USD',
    name: 'Litecoin',
    lastPrice: 0
  }
];

const priceToNumber = (priceStr) => {
  const price = parseInt(priceStr);
  return price * 100; //change to pennies
};

const percentChange = (amount, lastPrice) => {
  if(lastPrice === 0) {
    return '0%';
  }
  const current = priceToNumber(amount);
  const last = priceToNumber(lastPrice);
  const diff = (current - last) / current;
  const percentage = diff * 100;
  return percentage + '%';
};

module.exports = (req, res) => {
  const query = req.query;
  const currentCurrency = currency[currencyIndex];
  client.getSellPrice({'currencyPair': currentCurrency.currencyPair}, function(err, price) {
    res.setHeader('Content-Type', 'application/json');
    const data = price.data;


    let updates = {
      percentChange: percentChange(data.amount, currentCurrency.lastPrice),
      lastPrice: data.amount
    }

    const displayCurrency = Object.assign(currentCurrency, data, updates);
    currencyIndex++;
    if(currencyIndex >= currency.length) {
      currencyIndex = 0;
    }
    res.send(JSON.stringify(displayCurrency));
  });
};
