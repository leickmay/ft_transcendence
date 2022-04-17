import { configureStore, EnhancedStore, Store } from '@reduxjs/toolkit';
import usersSlice from './slices/usersSlice';

const store = configureStore({
	reducer: {
		users: usersSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
