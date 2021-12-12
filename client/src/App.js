import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {

    //call public api
    fetch("/public")
      .then((res) => res.json())
      .then((data) => setData(data.message));

  }, []);

  const handleRegisterClick = async () => {
    //call register
    const rawResponse = await fetch('/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ first_name: 'Artur', last_name: 'Edilyan', email: 'aedilyan@gmail.com', password: '123456' })
    });
    const content = await rawResponse.json();

    setToken(content.token);
  }

  const handleAuthClick = async () => {
    //call private api
    await fetch("/secure",
      {
        headers: {
          "x-access-token": token
        }
      })
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        <button onClick={handleRegisterClick}>{token ? 'AUTHENTICATED' : 'Authenticate user'}</button>
        <button onClick={handleAuthClick}>Call private API</button>
      </header>
    </div>
  );
}

export default App;
