import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store';
import App from './resources/pages/App';
import './resources/scss/index.scss';

ReactDOM.render(
	<React.StrictMode>
		<CookiesProvider>
			<BrowserRouter>
				<Provider store={store}>
					<App />
				</Provider>
			</BrowserRouter>
		</CookiesProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
