import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { CookiesProvider } from 'react-cookie';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io("http://localhost:3001");

socket.on("numbers", data => {
	console.log(data.num);
	socket.emit("increment", {num: ++data.num});
});

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
