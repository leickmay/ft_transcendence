import { GET_CHANNEL } from "../actions/channel.actions";

const initialState = null;

export default function channelReducer(state = initialState, action: any) {
	switch (action.type) {
		case GET_CHANNEL:
			return action.payload;
		default:
			return state;
	}
}