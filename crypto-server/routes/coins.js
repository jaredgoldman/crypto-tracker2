const express = require('express');
const router = express.Router();
const axios = require('axios');

const { 
  formatCoins, 
  formatCandles, 
  formatCandleRequest 
} = require('../helpers/api-helpers');

const { 
  getCoinByName, 
  addCoin, 
  addUserCoin, 
  getUserCoin, 
  getUserCoins 
} = require('../db/helpers/coinHelpers');

// GET TOP 100 COINS FROM COIN RANKING AND USER COINS 
router.get('/:id', (req, res) => {

  const { id } = req.params;
  const URL = `https://api.coinranking.com/v2/coins?limit=100`
  const config = {
    headers: {
      'x-access-token': process.env.CR_API
    }
  }

  axios.get(URL, config)
  .then(response => {
    // grab user coins from database 
    getUserCoins(id).then(userCoins => {
      const coins = formatCoins(response.data.data.coins);
      return res.status(200).json({userCoins, coins});
    })
  })
  .catch(err => {
    console.log(err)
  })
})

// ADD USER COIN AND SEND ALL USER COINS BACK
router.post('/add', (req, res) => {
  const { coinSymbol, userId } = req.body;
  let coinHolder = null;

  // check if coin is in database 
  getCoinByName(coinSymbol).
  then(coin => {
    coinHolder = coin;
    // if no - add coin 
    if (!coin) {
      addCoin(coinSymbol)
      .then(coinInfo => {
        coinHolder = coinInfo;
      })
    }
    // check if user has connection to coin 
    getUserCoin(userId, coinHolder)
    .then(coinConnect => {
      // if no - add user_coin and send coins back
      if (!coinConnect) {
        addUserCoin(userId, coinHolder.id)
        .then(userCoin => {
          getUserCoins(userId)
          .then(coins => {
            return res.status(200).json(coins)
          })
        })
      } else {
        // if yes - send error 
      return res.send('coin already on watchlist')
      }
    })
  })
  .catch(err => {
    console.log(err)
  })
})

// GET COIN CANDLES
router.get('/show/:coin/:candleLength', (req, res) => {
  const { coin, candleLength } = req.params;
  const candleData = formatCandleRequest(candleLength);
  const URL = `https://min-api.cryptocompare.com/data/v2/histo${candleData.candleUnit}?fsym=${coin}&tsym=USD&limit=${candleData.candleAmount}&api_key=${process.env.CC_API}`
  axios.get(URL)
  .then(coinData => {
    const candles = coinData.data.Data.Data;
    const formattedCandles = formatCandles(candles);
    return res.status(200).send(formattedCandles);
  })
  .catch(err => {
    console.log(err)
  })
})


module.exports = router;