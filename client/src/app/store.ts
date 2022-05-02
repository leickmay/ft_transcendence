import { configureStore } from '@reduxjs/toolkit';
import alertSlice from './slices/alertSlice';
import socketSlice from './slices/socketSlice';
import usersSlice from './slices/usersSlice';

const store = configureStore({
	reducer: {
		users: usersSlice,
		socket: socketSlice,
		alertType: alertSlice
	},
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
