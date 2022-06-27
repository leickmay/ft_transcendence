import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MatchResult } from "../interfaces/Stats";
import { User } from "../interfaces/User";
import { PacketPlayInProfile } from "../packets/PacketPlayInProfile";

export interface Invitation {
	target: number | undefined,
}

interface State {
	nbMatchs: number,
	matchWon: number,
	history: Array<MatchResult>,
	user: User | undefined,
	invitation: Invitation,
}

const initialState: State = {
	nbMatchs: 0,
	matchWon: 0,
	history: [],
	user: undefined,
	invitation: {
		target: undefined,
	},
}

const slice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		setInvitationTarget: (state: State, action: PayloadAction<number | undefined>): void => {
			state.invitation.target = action.payload;
		},
		setProfile: (state: State, action: PayloadAction<PacketPlayInProfile>): void => {
			state.user = action.payload.user;
			state.history = action.payload.history;
			state.matchWon = action.payload.matchWon;
			state.nbMatchs = action.payload.nbMatchs;
		},
		resetProfile: (state: State, action: PayloadAction<void>): void => {
			state.nbMatchs = 0;
			state.matchWon = 0;
			state.history = [];
			state.user = undefined;
		},
	}
});

export const { setInvitationTarget, setProfile, resetProfile } = slice.actions;
export default slice.reducer;
