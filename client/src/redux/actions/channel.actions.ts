import axios from "axios"

export const GET_CHANNEL = "GET_CHANNEL";

export const getChannel = (id: number) => {
	return (dispatch: any) => {
		/*return axios.get("http://" + window.location.hostname + ":3001/" + 'chat/one/' + id)
		.then((ret) => {dispatch({ type: GET_CHANNEL, payload: ret.data })})
		.catch((err) => {dispatch({ type: GET_CHANNEL, payload: null })});*/
	};
};