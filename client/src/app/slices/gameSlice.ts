import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ball, GameStatus, Player } from "../interfaces/Game.interface";
import { User } from "../interfaces/User";

interface State {
	refreshTime: number;
	width: number;
	height: number;
	status: GameStatus;
	minPlayers: number;
	maxPlayers: number;
	startTime: number;
	users: Array<User>;
	balls: Array<Ball>;
	// spectators: Array<Spectator>;
}

const initialState: State = {
	refreshTime: 10,
	status: GameStatus.NONE,
	width: 1920,
	height: 1080,
	minPlayers: 2,
	maxPlayers: 2,
	startTime: 5,
	users: [],
	balls: [],
}

const slice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setPlayers: (state: State, action: PayloadAction<Array<Player>>): void => {
			state.users = action.payload.map(p => p.user);
		},
		addPlayer: (state: State, action: PayloadAction<Player>): void => {
			state.users.push(action.payload.user);
		},
		removePlayer: (state: State, action: PayloadAction<number>): void => {
			let users = state.users.filter(u => u.id !== action.payload);
			state.users = users;
		},
		setPlayerReady: (state: State, action: PayloadAction<number>): void => {
			let user = state.users.find(u => u.id === action.payload);
			if (user)
				user.ready = true;
		},
		updateGame: (state: State, action: PayloadAction<Partial<State>>): void => {
			Object.assign(state, action.payload);
		},
	}
});

export const { setPlayers, addPlayer, removePlayer, setPlayerReady, updateGame } = slice.actions;
export default slice.reducer;
