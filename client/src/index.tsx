import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { CookiesProvider } from 'react-cookie';
import { io } from 'socket.io-client';

const socket = io("ws://localhost:3001");

socket.emit("events", {id: 5});

socket.on("meuh", (...args) => {
	console.log(...args);
});

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
