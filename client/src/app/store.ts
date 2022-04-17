import { combineReducers, configureStore, Reducer, Store } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';

const userReducers: Reducer = combineReducers({
	user: userSlice,
});

const store: Store = configureStore({
	reducer: {
		user: userReducers,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
