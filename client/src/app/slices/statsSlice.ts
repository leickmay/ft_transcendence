import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MatchResult } from "../interfaces/Stats";

interface State {
	nbMatchs: number,
	matchWon: number,
	history: Array<MatchResult>,
}

const initialState: State = {
	nbMatchs: 0,
	matchWon: 0,
	history: [],
}

const slice = createSlice({
	name: 'stats',
	initialState,
	reducers: {
		setUserStats: (state: State, action: PayloadAction<State>): State => {
			return {
				...state,
				...action.payload,
			};
		},
	}
});

export const { setUserStats } = slice.actions;
export default slice.reducer;

