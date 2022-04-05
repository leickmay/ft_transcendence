import { GET_USER, GET_USER_BY_ID, GET_PROFILE } from "../actions/user.actions";

const initialState = null;

export default function userReducer(state = initialState, action: any) {
	switch (action.type) {
		case GET_USER:
			return action.payload;
		case GET_USER_BY_ID:
			return action.payload;
		case GET_PROFILE:
			return action.payload;
		default:
			return state;
	}
}