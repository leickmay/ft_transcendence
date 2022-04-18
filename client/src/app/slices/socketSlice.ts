import { createSlice, PayloadAction, applyMiddleware, AnyAction, Slice } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

interface State {
	socket?: Socket;
}

const initialState: State = {};

const slice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		setSocket: (state: State, action: PayloadAction<Socket>): State => {
			return {
				...state,
				socket: action.payload,
			} as State;
		},
	},
});

export const { setSocket } = slice.actions;
export default slice.reducer;
