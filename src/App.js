import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [apiMessage, setApiMessage] = useState('Loading...');

  useEffect(() => {
    fetch('https://render-deploy-iib7.onrender.com/')
      .then((res) => res.text())
      .then((data) => setApiMessage(data))
      .catch((err) => setApiMessage('Error fetching API'));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <strong>API Response:</strong> {apiMessage}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
