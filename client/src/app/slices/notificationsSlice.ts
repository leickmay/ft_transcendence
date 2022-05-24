import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
	next: number,
	visibles: Array<{
		id: number,
		message: string,
	}>;
}

const initialState: State = {
	next: 0,
	visibles: [],
}

const slice = createSlice({
	name: 'alerts',
	initialState,
	reducers: {
		pushNotification: (state: State, action: PayloadAction<string>): State => {
			return {
				...state,
				next: state.next + 1,
				visibles: [
					{
						id: state.next,
						message: action.payload,
					},
					...state.visibles,
				],
			}
		},
		popNotification: (state: State) => {
			return {
				...state,
				visibles: state.visibles.slice(0, state.visibles.length - 1),
			}
		},
	}
});

export const { pushNotification, popNotification } = slice.actions;
export default slice.reducer;
