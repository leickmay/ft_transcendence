import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ball, GameStatus, Player } from "../interfaces/Game.interface";

interface State {
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
		setPlayers: (state: State, action: PayloadAction<Array<Player>>): State => {
			return {
				...state,
				players: action.payload,
			};
		},
		addPlayer: (state: State, action: PayloadAction<Player>): State => {
			if (!!state.players.find(p => p.user.id === action.payload.user.id))
				return state;
			return {
				...state,
				players: [
					...state.players,
					action.payload,
				],
			};
		},
		removePlayer: (state: State, action: PayloadAction<number>): State => {
			return {
				...state,
				players: [
					...state.players.filter(p => p.user.id !== action.payload),
				],
			};
		},
		setPlayerReady: (state: State, action: PayloadAction<number>): State => {
			return {
				...state,
				players: [
					...state.players.map(p => ({
						...p,
						ready: p.ready || p.user.id === action.payload,
					})),
				],
			};
		},
		updateGame: (state: State, action: PayloadAction<Partial<State>>): State => {
			return {
				...state,
				...action.payload,
			}
		},
	}
});

export const { setPlayers, addPlayer, removePlayer, setPlayerReady, updateGame } = slice.actions;
export default slice.reducer;
