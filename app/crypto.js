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
  return `${percentage.toPrecision(2)}%`;
};

const money = (num) => {
  const p = String(num).split('.');
  const neg = '';
  const currencySymbol = '$';
  if (p[0][0] === '-') {
    p[0] = p[0].substr(1);
    neg = '-';
  }
  if (!p[1]) {
    p[1] = '00';
  } else if (p[1].length === 1) {
    p[1] = String(p[1]+ '0');
  } else {
    //lol at javascript math
    p[1] = String(p[1]).substr(0, 2);
  }
  return neg + currencySymbol + p[0] + '.' + p[1];
}

module.exports = (req, res) => {
  const query = req.query;
  let currencyIndex = +query.currency;
  if (isNaN(currencyIndex) || currencyIndex > 2) {
    currencyIndex = 0;
  }
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
        price: money(currentPrice / 100),
        lastPrice: money(lastPrice / 100),
        priceChange: money(priceDiff / 100),
        percentChange: precentage
      };

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(displayData));
    }
  });
};
