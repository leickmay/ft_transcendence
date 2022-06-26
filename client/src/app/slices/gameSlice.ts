import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameStatus } from "../interfaces/Game.interface";

interface State {
	tps: number;
	width: number;
	height: number;
	status: GameStatus;
	minPlayers: number;
	maxPlayers: number;
	startTime: number;
	maxDifference: number;
	// spectators: Array<Spectator>;
}

const initialState: State = {
	tps: 20,
	status: GameStatus.NONE,
	width: 1920,
	height: 1080,
	minPlayers: 2,
	maxPlayers: 2,
	startTime: 5,
	maxDifference: 10,
}

const slice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		updateGame: (state: State, action: PayloadAction<Partial<State>>): void => {
			Object.assign(state, action.payload);
		},
		resetGame: () => initialState,
	}
});

export const { updateGame, resetGame } = slice.actions;
export default slice.reducer;
