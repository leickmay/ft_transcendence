import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../interfaces/User";

interface State extends Array<User> {
}

const initialState: State = [
];

const slice = createSlice({
	name: 'leaderboard',
	initialState,
	reducers : {
		setBoard: (state: State, action: PayloadAction<Array<User>>) : State => {
			return action.payload;
		},
	}
});

export const {setBoard} = slice.actions;
export default slice.reducer;