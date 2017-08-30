const request = require('request');

let currencyIndex = 0;
const currency = [
  {
    currencyPair: 'BTC-USD',
    name: 'Bitcoin'
  }, {
    currencyPair: 'ETH-USD',
    name: 'Ethereum'
  }, {
    currencyPair: 'LTC-USD',
    name: 'Litecoin'
  }
];

const priceToNumber = (priceStr) => {
  const price = parseFloat(priceStr);
  return price * 100; //change to pennies
};

const priceChange = (amount, lastPrice) => {
  return amount - lastPrice;
};

const precentChange = (amount, diff) => {
  const percentage = (diff / amount) * 100;
  return `${percentage.toPrecision(3)}%`;
};

module.exports = (req, res) => {
  const currentCurrency = currency[currencyIndex];
  const url = `https://www.coinbase.com/api/v2/prices/${currentCurrency.currencyPair}/historic?period=day`;
  request({url: url, json: true}, (error, response, json) => {
    if(!error) {
      const data = json.data;
      const pricesLen = data.prices.length - 1;
      const currentPrice = priceToNumber(data.prices[0].price);
      const lastPrice = priceToNumber(data.prices[pricesLen].price);
      const priceDiff = priceChange(currentPrice, lastPrice);
      const precentage = precentChange(currentPrice, priceDiff);
      let displayData = {
        name: currentCurrency.name,
        price: `$${currentPrice / 100}`,
        lastPrice: `$${lastPrice / 100}`,
        priceChange: `$${priceDiff / 100}`,
        percentChange: precentage
      };

      currencyIndex++;
      if(currencyIndex >= currency.length) {
        currencyIndex = 0;
      }

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(displayData));
    }
  });
};
