import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { containsUser, User } from '../interfaces/User';

interface State {
	current?: User;
	online: Array<User>;
}

const initialState: State = {
	online: [],
};

const slice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setCurrentUser: (state: State, action: PayloadAction<User>): State => {
			return {
				...state,
				current: action.payload,
			};
		},
		setOnlineUsers: (state: State, action: PayloadAction<Array<User>>): State => {
			return {
				...state,
				online: action.payload,
			};
		},
		addOnlineUser: (state: State, action: PayloadAction<User>): State => {
			if (containsUser(state.online, action.payload) || state.current?.id == action.payload.id)
				return state;
			return {
				...state,
				online: [
					...state.online,
					action.payload,
				],
			};
		},
		removeOnlineUser: (state: State, action: PayloadAction<User>): State => {
			return {
				...state,
				online: [
					...state.online.filter(e => e.id !== action.payload.id),
				],
			};
		},
	},
});

export const { setCurrentUser, setOnlineUsers, addOnlineUser, removeOnlineUser } = slice.actions;
export default slice.reducer;
