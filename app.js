
function createStorage() {
  let currencyBackup = [];

  return {
    getCurrency: function() {
      return currencyBackup;
    },
    setCurrency: function(newCurrency) {
      currencyBackup = newCurrency;
    }
  }
}

const storage = createStorage();

function renderCurrency(currencies) {
  let htmlStr = currencies.reduce(function(acc, currency, index) {
    return acc + `<tr>
      <td>${index + 1}</td>
      <td>${currency.r030}</td>
      <td>${currency.txt}</td>
      <td>${currency.cc}</td>
      <td>${currency.rate.toFixed(2)}</td>
      <td>${currency.exchangedate}</td>
      </tr>`
  }, '');
  document.getElementById('currencies-tbody').innerHTML = htmlStr;
};

fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=20230117&json').then(function(data) {
  return data.json();
}).then(function(data) {
  storage.setCurrency(data);
  renderCurrency(data);
});

document.getElementById('search').onkeyup = function(e) {
  let currentSearch = e.currentTarget.value.toLowerCase().trim();
  let backup = storage.getCurrency();
  const filterdCurrencies = backup.filter(function(currency) {
    return currency.txt.toLowerCase().includes(currentSearch) || 
      currency.cc.toLowerCase().includes(currentSearch);
  })
  renderCurrency(filterdCurrencies);
}

document.getElementById('date-change').onchange = function (e) {
  let date = document.getElementById('date-change').value.split('-').join('');
  fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date='+ date +'&json').then(function(data) {
    return data.json();
  }).then(function(data) {
    storage.setCurrency(data);
    renderCurrency(data);
  });
}