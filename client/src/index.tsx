import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store';
import App from './resources/layouts/App';
import './resources/scss/index.scss';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
	<React.StrictMode>
		<CookiesProvider>
			<BrowserRouter>
				<Provider store={store}>
					<App />
				</Provider>
			</BrowserRouter>
		</CookiesProvider>
	</React.StrictMode>
);
