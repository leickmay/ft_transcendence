import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
	connected: boolean;
}

const initialState: State = {
	connected: false,
};

const slice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		connected: (state: State, action: PayloadAction<boolean>): State => {
			return {
				...state,
				connected: action.payload,
			}
		}
	},
});

export const {  } = slice.actions;
export default slice.reducer;
