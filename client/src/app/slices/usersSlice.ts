import { createSlice, PayloadAction, applyMiddleware, AnyAction, Slice } from '@reduxjs/toolkit';
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
			} as State;
		},
		setOnlineUsers: (state: State, action: PayloadAction<Array<User>>): State => {
			return {
				...state,
				online: action.payload,
			} as State;
		},
		addOnlineUser: (state: State, action: PayloadAction<User>): State => {
			if (containsUser(state.online, action.payload))
				return state;
			return {
				...state,
				online: [
					...state.online,
					action.payload,
				],
			} as State;
		},
		removeOnlineUser: (state: State, action: PayloadAction<User>): State => {
			return {
				...state,
				online: [
					...state.online.filter(e => e != action.payload),
				],
			} as State;
		},
	},
});

export const { setCurrentUser, setOnlineUsers, addOnlineUser, removeOnlineUser } = slice.actions;
export default slice.reducer;
