import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface State {
    alertType: string;
}

const initialState: State = {
    alertType: ""
}

const slice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        alertType: (state: State, action: PayloadAction<string>): State => {
            return {
                ...state,
                alertType: action.payload,
            }
        }
    }
});

export const { alertType } = slice.actions;
export default slice.reducer;