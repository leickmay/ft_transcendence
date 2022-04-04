import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from 'redux-thunk';
import App from './App';
import "./styles/index.scss"
import rootReducer from "./redux"
import { getUsers } from './redux/actions/users.actions';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk))); // enelever composeWithDevTools for production
store.dispatch(getUsers());

ReactDOM.render(
	<Provider store={store}>
		<React.StrictMode>
			<App/>
		</React.StrictMode>
	</Provider>,
  document.getElementById('root')
);
