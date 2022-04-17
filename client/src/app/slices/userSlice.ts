import { createSlice, PayloadAction, applyMiddleware, AnyAction, Slice } from '@reduxjs/toolkit';
import { User } from '../interfaces/User';

interface CounterState {
	value?: User;
}
  
const initialState: CounterState = {
}

const userSlice: Slice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			return {
				...state,
				value: action.payload,
			}
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
