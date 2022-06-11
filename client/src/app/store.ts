import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './slices/chatSlice';
import notificationsSlice from './slices/notificationsSlice';
import socketSlice from './slices/socketSlice';
import usersSlice from './slices/usersSlice';
import gameSlice from './slices/gameSlice';

const store = configureStore({
	reducer: {
		chat: chatSlice,
		notifications: notificationsSlice,
		socket: socketSlice,
		users: usersSlice,
		game: gameSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
