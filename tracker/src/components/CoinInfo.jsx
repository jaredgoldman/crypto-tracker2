import "./CoinInfo.scss"

export default function CoinInfo(props) {
const { coinInfo } = props


  return (
    <div className="coin-info">
      <div>
        <img src={coinInfo.icon}></img>
      </div>
      <div>
        <h2>Symbol</h2>
        <p>{coinInfo.ticker}</p>
      </div>
      <div>
        <h2>Rank</h2>
        <p>{coinInfo.rank}</p>
      </div>
      {coinInfo.website && <div>
        <h2>website</h2>
        <p>{coinInfo.ticker}</p>
      </div>}
      <div>
        <h2>Price</h2>
        <p>{coinInfo.price}</p>
      </div>
      <div>
        <h2>Price (BTC)</h2>
        <p>{coinInfo.btcPrice}</p>
      </div>
      <div>
        <h2>24h Change</h2>
        <p>{coinInfo.change}</p>
      </div>
      <div>
        <h2>Total Supply</h2>
        <p>{coinInfo.totalSupply}</p>
      </div>
      <div>
        <h2>Market Cap</h2>
        <p>{coinInfo.totalSupply}</p>
      </div>
      <div>
        <h2>Volume</h2>
        <p>{coinInfo.volume}</p>
      </div>
      <div>
        <h2>ATH</h2>
        <p>{coinInfo.allTimeHigh.price}</p>
        <p>{coinInfo.allTimeHigh.timestamp}</p>
      </div>
    </div>
  )

}