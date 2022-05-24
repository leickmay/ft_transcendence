import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
	ready: boolean;
}

const initialState: State = {
	ready: false,
};

const slice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		ready: (state: State, action: PayloadAction<boolean>): State => {
			return {
				...state,
				ready: action.payload,
			}
		}
	},
});

export const { ready } = slice.actions;
export default slice.reducer;
