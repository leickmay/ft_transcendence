import { GET_CHANNELS, CREATE_CHANNEL, UPDATE_CHANNEL } from "../actions/channels.actions";

const initialState = {};

export default function channelsReducer(state = initialState, action: any) {
	switch (action.type) {
		case GET_CHANNELS:
			return action.payload;
		case CREATE_CHANNEL:
			return action.payload;
		case UPDATE_CHANNEL:
			return action.payload;
		default:
			return state;
	}
}