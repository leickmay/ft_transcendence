import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserStats } from "../interfaces/Stats";

interface State extends UserStats {
}

const initialState: State = {
	nbMatchs: 0,
	matchWon: 0,
	history: [],
}

const slice = createSlice({
	name: 'stats',
	initialState,
	reducers : {
		setStats: (state: State, action: PayloadAction<UserStats>) : State => {
			return {
				...state,
				...action.payload,
			};
		},
	}
});

export const {setStats} = slice.actions;
export default slice.reducer;
