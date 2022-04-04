import { combineReducers } from "redux";
import usersReducer from "./reducers/users.reducer"
import userReducer from "./reducers/user.reducer"
import channelsReducer from "./reducers/channels.reducer"
import channelReducer from "./reducers/channel.reducer"

export default combineReducers({
	usersReducer,
	userReducer,
	channelsReducer,
	channelReducer,
});