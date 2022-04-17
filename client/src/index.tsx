import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './resources/pages/App';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from 'react-router-dom';

import './resources/scss/index.scss';

ReactDOM.render(
	<React.StrictMode>
		<CookiesProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</CookiesProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
