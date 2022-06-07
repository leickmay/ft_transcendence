import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
	next: number,
	duration: number,
	actives: Array<{
		id: number,
		message: string,
		visible: boolean,
	}>;
}

const initialState: State = {
	next: 0,
	duration: 4000,
	actives: [],
}

const slice = createSlice({
	name: 'alerts',
	initialState,
	reducers: {
		addNotification: (state: State, data: PayloadAction<string>): State => {
			return {
				...state,
				next: state.next + 1,
				actives: [
					{
						id: state.next,
						message: data.payload,
						visible: true,
					},
					...state.actives,
				],
			}
		},
		hideNotification: (state: State, data: PayloadAction<number>) => {
			return {
				...state,
				actives: state.actives.map(n => n.id === data.payload ? {...n, visible: false} : n),
			}
		},
		popNotification: (state: State) => {
			return {
				...state,
				actives: state.actives.slice(0, state.actives.length - 1),
			}
		},
	}
});

export const { addNotification, hideNotification, popNotification } = slice.actions;
export default slice.reducer;
