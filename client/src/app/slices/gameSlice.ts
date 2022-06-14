import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameStatus } from "../interfaces/Game.interface";

interface State {
	refreshTime: number;
	width: number;
	height: number;
	status: GameStatus;
	minPlayers: number;
	maxPlayers: number;
	startTime: number;
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
}

const slice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		updateGame: (state: State, action: PayloadAction<Partial<State>>): void => {
			Object.assign(state, action.payload);
		},
	}
});

export const { updateGame } = slice.actions;
export default slice.reducer;
