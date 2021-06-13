import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import Watchlist from './components/Watchlist/Watchlist';
import CoinDash from "./components/CoinDash"
import SettingsDash from "./components/SettingsDash"
import ExchangeDash from "./components/ExchangeDash"

import useCoinData from "./hooks/useCoinData"
import useUserData from "./hooks/useUserData"
import useExchangeData from "./hooks/useExchangeData"


export default function App() {

  const { 
    // coins
    addUserCoin,
    deleteUserCoin,
    setCoin,
    setCandleLength,
    setCandles,
    setCurrency,
    coinState,
    trades,
    userCoinStats,
    currency
  } = useCoinData();

  const {    
    handleLogin, 
    handleLogout, 
    handleRegister,
    handleAlert,
    cookies,
    alert
  } = useUserData();

  const { 
    addExchange, 
    exchanges 
  } = useExchangeData();
  

  return (
    <main>
      <Router>
        <header>
          <nav>
            <Link className="nav-text" to="/">Crypto-Tracker</Link>
            {!cookies.user_id && 
              <div>
                <Link className="nav-text" to="/login">Login</Link>
                <Link className="nav-text" to="/register">Register</Link>
              </div>
            }
            {cookies.user_id && 
              <div>
                <Link className="nav-text" to="/watchlist">Watchlist</Link>
                <Link className="nav-text" to="/exchange">Exchanges</Link>
                <Link className="nav-text" to="/settings">Settings</Link>
                <Link className="nav-text" to="/logout" onClick={() => handleLogout()}>Logout</Link>
              </div>
            }
          </nav>
        </header>
        <Switch>
          <Route path="/login">
          {cookies.user_id ? <Redirect to="/watchlist" /> :
            <LoginForm handleLogin={handleLogin} alert={alert}/> }
          </Route>
          <Route path="/register">
          {cookies.user_id ? <Redirect to="/watchlist" /> :
            <RegisterForm handleRegister={handleRegister} alert={alert}/> }
          </Route>
          <Route path="/watchlist">
            <Watchlist 
              handleAlert={handleAlert}
              cookies={cookies}
              addUserCoin={addUserCoin}
              deleteUserCoin={deleteUserCoin}
              setCoin={setCoin}
              alert={alert}
            />
          </Route>
          <Route path="/coins">
            <CoinDash 
              setCandleLength={setCandleLength}
              setCandles={setCandles}
              coinState={coinState}
              trades={trades}
              currency={currency}
              // balance={balance}
              userCoinStats={userCoinStats}
             />
          </Route>
          <Route path="/exchange">
            <ExchangeDash addExchange={addExchange} exchanges={exchanges} alert={alert}/>
          </Route>
          <Route path="/settings">
            <SettingsDash setCurrency={setCurrency}/>
          </Route>
          <Route exact path="/">
          {!cookies.user_id ? <Redirect to="/login" /> :
            <h1>home page</h1> }
          </Route>
        </Switch>
      </Router>
    </main>
  )
 
}

