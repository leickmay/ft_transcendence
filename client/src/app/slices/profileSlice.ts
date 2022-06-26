import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MatchResult } from "../interfaces/Stats";
import { User } from "../interfaces/User";
import { PacketPlayInProfile } from "../packets/PacketPlayInProfile";

export interface Invitation {
	status: InvitationStates,
	target: number,
}

export enum InvitationStates {
	NO_INVITATION,
	PENDING_INVITATION,
	IN_GAME,
};

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
		status: InvitationStates.NO_INVITATION,
		target: -1,
	}
}

const slice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		setInvitation: (state: State, action: PayloadAction<Invitation>): void => {
			state.invitation.status = action.payload.status;
			state.invitation.target = action.payload.target;
		},
		setInvitationStatus: (state: State, action: PayloadAction<InvitationStates>): void => {
			state.invitation.status = action.payload;
		},
		setInvitationTarget: (state: State, action: PayloadAction<number>): void => {
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

export const { setInvitationTarget, setInvitationStatus, setInvitation, setProfile, resetProfile } = slice.actions;
export default slice.reducer;
