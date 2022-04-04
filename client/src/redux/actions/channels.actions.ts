import axios from "axios"

export const GET_CHANNELS = "GET_CHANNELS";
export const CREATE_CHANNEL = "CREATE_CHANNEL";
export const UPDATE_CHANNEL = "UPDATE_CHANNEL";

export const getChannels = () => {
	return (dispatch: any) => {
		/*return axios.get("http://" + window.location.hostname + ":3001/" + 'chat/all', {headers: {name: 'lol', token: 'love'}})
		.then((ret) => {dispatch({ type: GET_CHANNELS, payload: ret.data })})
		.catch((err) => console.log(err));*/
	};
};

export const createChannel = (name: string) => {
	return (dispatch: any) => {
		/*axios.post("http://" + window.location.hostname + ":3001/" + 'chat/create/' + name);
		return axios.get("http://" + window.location.hostname + ":3001/" + 'chat/all', {headers: {name: 'lol', token: 'love'}})
		.then((ret) => {dispatch({ type: GET_CHANNELS, payload: ret.data })})
		.catch((err) => console.log(err));*/
	};
};

export const updateChannel = (id: number, dataChan: any) => {
	return (dispatch: any) => {
		/*axios.patch("http://" + window.location.hostname + ":3001/" + 'chat/update/' + id, dataChan);
		return axios.get("http://" + window.location.hostname + ":3001/" + 'chat/all', {headers: {name: 'lol', token: 'love'}})
		.then((ret) => {dispatch({ type: GET_CHANNELS, payload: ret.data })})
		.catch((err) => console.log(err));*/
	};
};