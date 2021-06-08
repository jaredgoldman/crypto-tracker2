const db = require('../index');

const getUserTransactions = (userId) => {
  const query = {
    text: `SELECT account_id, transaction_id, coin_symbol, base_currency, quote_currency, side, order_type, unit_price, amount, cost, transaction_fee
    FROM transactions
    INNER JOIN accounts
    ON transactions.account_id = accounts.id
    INNER JOIN users
    ON users.id = accounts.user_id
    WHERE users.id = $1`,
    values: [userId]
    }

  return db.query(query)
    .then(result => result.rows)
    .catch(err => err);
}

// { tradeId: 'TWRDAI-AWW4S-BVI7LI',
// baseCurrency: 'ADA',
// quoteCurrency: 'USD',
// coinSymbol: 'ADA/USD',
// unitPrice: 2,
// amount: 500,
// cost: 1000,
// time: '2021-05-17T22:38:51.499Z',
// orderType: 'limit',
// side: 'buy',
// fee: 1.6,
// feeCurrency: 'USD' } ]

const addUserTransaction = (txnData) => {
  const {accountId, transactionId, coinSymbol, baseCurrency, quoteCurrency, 
    orderType, side, unitPrice, amount, cost, time, fee, feeCurrency} = txnData; 
    const query = {
      text: `INSERT INTO transactions (account_id, transaction_id, coin_symbol, base_currency, quote_currency, 
      side, order_type, unit_price, amount, cost, transaction_time, 
      transaction_fee, fee_currency) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      values: [accountId, transactionId, coinSymbol, baseCurrency, quoteCurrency, side, orderType, unitPrice, amount, cost, time, fee, feeCurrency]
    }

  return db.query(query)
    .then(result => result.rows[0])
    .catch(err => err);
}

const addExchange = (exchangeName, exchangeWebsite) => {
  const query = {
    text: `INSERT INTO exchanges (name) VALUES ($1) RETURNING *` ,
    values: [exchangeName, exchangeWebsite]
  }

  return db.query(query)
    .then(result => result.rows[0])
    .catch(err => err);
}

const getExchangeByName = (exchangeName) => {
  const query = {
    text: "SELECT * FROM exchanges WHERE name = $1",
    values: [exchangeName]
  }
  return db.query(query)
    .then(result => result.rows[0])
    .catch(err => err);
}

const addUserAccount = (exchangeData) => {
  const { accountName, userId, exchangeId, apiKey, apiSecret } = exchangeData;
    const query = {
      text: `INSERT INTO accounts (account_name, user_id, exchange_id, api_key, api_secret) VALUES ($1, $2, $3, $4, $5) RETURNING *` ,
      values: [accountName, userId, exchangeId, apiKey, apiSecret]
    }

  return db.query(query)
    .then(result => result.rows[0])
    .catch(err => err);
}

const getUserAccounts = (userId) => {
  const query = {

    text: `SELECT accounts.id, accounts.account_name, accounts.api_key, accounts.api_secret, exchanges.name as exchange_name
    FROM users
    INNER JOIN accounts
    ON users.id = accounts.user_id
    INNER JOIN exchanges
    ON accounts.exchange_id = exchanges.id
    WHERE users.id = $1`,
    values: [userId]
  } 

  return db.query(query)
    .then(result => result.rows)
    .catch(err => err);
}



module.exports = {
  addUserAccount,
  getUserAccounts,
  addExchange,
  getExchangeByName,
  addUserTransaction,
  getUserTransactions
}