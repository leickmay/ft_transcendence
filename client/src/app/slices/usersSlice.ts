import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { containsUser, UserPreview, UpdateUserDto, User } from '../interfaces/User';

interface State {
	current?: User;
	friends: Array<User>;
	online:  Array<UserPreview>;
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
			return {
				...state,
				current: action.payload,
			};
		},
		updateUser: (state: State, action: PayloadAction<UpdateUserDto>): State => {
			if (state.current?.id === action.payload.id) {
				return {
					...state,
					current: {...state.current, ...action.payload},
				}
			}

			return {
				...state,
				friends: state.friends.map(friend => friend.id === action.payload.id ? {...friend, ...action.payload} : friend),
			};
		},
		setTotp: (state: State, action: PayloadAction<boolean>): State => {
			if (!state.current) {
				return state;
			}
			return {
				...state,
				current: {
					...state.current,
					totp: action.payload,
				}
			};
		},
		setFriends: (state: State, action: PayloadAction<Array<User>>): State => {
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
				friends: [
					...state.friends.filter(e => e.id !== action.payload.id),
				],
			};
		},
		addOnlineUser: (state: State, action: PayloadAction<UserPreview>): State => {
			if (state.online.find( x => x.id === action.payload.id) || state.current?.id === action.payload.id)
				return state;
			return {
				...state,
				online: [
					...state.online,
					action.payload,
				],
			};
		},
		removeOnlineUser: (state: State, action: PayloadAction<UserPreview>): State => {
			return {
				...state,
				online: [
					...state.online.filter(u => u.id !== action.payload.id),
				],
			};
		}
	},
});

export const { setCurrentUser, updateUser, setTotp, setFriends, addFriend, removeFriend, addOnlineUser, removeOnlineUser } = slice.actions;
export default slice.reducer;
