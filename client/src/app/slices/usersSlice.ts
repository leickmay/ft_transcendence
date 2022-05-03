import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { containsUser, User } from '../interfaces/User';

interface State {
	current?: User;
	friends: Array<User>;
	online: Array<User>;
}

const initialState: State = {
	friends: [],
	online: [],
};

const slice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setCurrentUser: (state: State, action: PayloadAction<User>): State => {
			console.log(action.payload);
			console.log(action.payload.friends);
			
			return {
				...state,
				current: action.payload,
				friends: action.payload.friends || [],
			};
		},
		setFriends: (state: State, action: PayloadAction<Array<User>>): State => {
			console.log(action.payload);
			return {
				...state,
				friends: action.payload,
			};
		},
		addFriend: (state: State, action: PayloadAction<User>): State => {
			if (containsUser(state.friends, action.payload) || state.current?.id === action.payload.id)
				return state;
			return {
				...state,
				friends: [
					...state.friends,
					action.payload,
				],
			};
		},
		removeFriend: (state: State, action: PayloadAction<User>): State => {
			return {
				...state,
				online: [
					...state.friends.filter(e => e.id !== action.payload.id),
				],
			};
		},
		setOnlineUsers: (state: State, action: PayloadAction<Array<User>>): State => {
			return {
				...state,
				online: action.payload,
			};
		},
		addOnlineUser: (state: State, action: PayloadAction<User>): State => {
			if (containsUser(state.online, action.payload) || state.current?.id === action.payload.id)
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

export const { setCurrentUser, setFriends, addFriend, removeFriend, setOnlineUsers, addOnlineUser, removeOnlineUser } = slice.actions;
export default slice.reducer;
