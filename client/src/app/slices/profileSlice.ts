import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MatchResult } from "../interfaces/Stats";
import { User } from "../interfaces/User";

interface State {
	nbMatchs: number,
	matchWon: number,
	history: Array<MatchResult>,
	user: User | undefined,
}

const initialState: State = {
	nbMatchs: 0,
	matchWon: 0,
	history: [],
	user: undefined,
}

const slice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		setProfile: (state: State, action: PayloadAction<State>): State => {
			return {
				...state,
				...action.payload,
			};
		},
	}
});

export const { setProfile } = slice.actions;
export default slice.reducer;
