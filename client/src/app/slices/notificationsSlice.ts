import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
	text: string;
	duration?: number;
	button?: {
		text: string;
		action: 'ACCEPT_GAME_INVITATION' | string,
		data?: {
			id: number;
		},
	}
}

interface State {
	next: number,
	duration: number,
	actives: Array<{
		id: number,
		content: Notification,
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
		addNotification: (state: State, data: PayloadAction<Notification>): State => {
			return {
				...state,
				next: state.next + 1,
				actives: [
					{
						id: state.next,
						content: data.payload,
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
		popNotification: (state: State, data: PayloadAction<number>) => {
			return {
				...state,
				actives: state.actives.filter(n => n.id !== data.payload),
			}
		},
	}
});

export const { addNotification, hideNotification, popNotification } = slice.actions;
export default slice.reducer;
