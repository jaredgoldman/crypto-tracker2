import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import axios from 'axios'

export default function useApplicationData() {

  const [cookies, setCookie, removeCookie] = useCookies(['user_id']);
  const [alert, setAlert] = useState(null);
  const [coins, setCoins] = useState(null)

  const handleAlert = (alert) => {
    setAlert(alert)
    setTimeout(() => {
      setAlert(null);
    }, 3000)
  }

  const handleLogin = (userData) => {
    const { password, email } = userData;
    axios
    .post(`http://localhost:3001/api/users/login`, {password, email})
    .then((res) => {
      if (res.status === 200) {
        setCookie('user_id', res.data, { path: '/' });
      }
    })
    .catch((err) => {
      handleAlert(err.response.data);
    });
  }

  const handleLogout = () => {
    removeCookie("user_id");
  }

  const handleRegister = (userData) => {
    const { firstName, lastName, password, email } = userData;
    axios
    .post(`http://localhost:3001/api/users/register`, {firstName, lastName, password, email})
    .then(res => {
      if (res) {
        return setCookie('user_id', res.data.id, { path: '/' });
      }
    })
    .catch((err) => {
      handleAlert(err.response.data)
    });
  }

  // Load coins when user signs in 
  useEffect(() => {
    if (cookies.user_id) {
      axios.get(`http://localhost:3001/api/exchange/coins`)
      .then(res => {
        setCoins(res.data);
      })
    }
  }, [cookies.user_id])

  return { handleLogin, handleLogout, handleRegister, cookies, alert, coins }

}