import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './slices/chatSlice';
import leaderboardSlice from './slices/leaderboardSlice';
import notificationsSlice from './slices/notificationsSlice';
import profileSlice from './slices/profileSlice';
import socketSlice from './slices/socketSlice';
import statsSlice from './slices/statsSlice';
import usersSlice from './slices/usersSlice';
import gameSlice from './slices/gameSlice';

const store = configureStore({
	reducer: {
		chat: chatSlice,
		notifications: notificationsSlice,
		socket: socketSlice,
		users: usersSlice,
		game: gameSlice,
		stats: statsSlice,
		board: leaderboardSlice,
		profile: profileSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
