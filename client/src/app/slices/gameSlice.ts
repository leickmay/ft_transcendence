import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ball, GameStatus, Player } from "../interfaces/Game.interface";

interface State {
	refreshTime: number;
	width: number;
	height: number;
	status: GameStatus;
	minPlayers: number;
	maxPlayers: number;
	startTime: number;
	players: Array<Player>;
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
	players: [],
	balls: [],
}

const slice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setPlayers: (state: State, action: PayloadAction<Array<Player>>): void => {
			state.players = action.payload;
		},
		addPlayer: (state: State, action: PayloadAction<Player>): void => {
			state.players.push(action.payload);
		},
		removePlayer: (state: State, action: PayloadAction<number>): void => {
			let players = state.players.filter(p => p.user.id !== action.payload);
			state.players = players;
		},
		setPlayerReady: (state: State, action: PayloadAction<number>): void => {
			let player = state.players.find(p => p.user.id === action.payload);
			if (player)
				player.ready = true;
		},
		updateGame: (state: State, action: PayloadAction<Partial<State>>): void => {
			Object.assign(state, action.payload);
		},
	}
});

export const { setPlayers, addPlayer, removePlayer, setPlayerReady, updateGame } = slice.actions;
export default slice.reducer;
