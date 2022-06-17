import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './slices/chatSlice';
import leaderboardSlice from './slices/leaderboardSlice';
import notificationsSlice from './slices/notificationsSlice';
import socketSlice from './slices/socketSlice';
import statsSlice from './slices/statsSlice';
import usersSlice from './slices/usersSlice';

const store = configureStore({
	reducer: {
		chat: chatSlice,
		notifications: notificationsSlice,
		socket: socketSlice,
		users: usersSlice,
		stats: statsSlice,
		board: leaderboardSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
