import axios from "axios"

export const GET_USERS = "GET_USERS";
export const REGISTER_USER = "REGISTER_USER";
export const UPDATE_USER = "UPDATE_USER";

export const getUsers = () => {
	return (dispatch: any) => {
		/*return axios.get("http://" + window.location.hostname + ":3001/" + 'clients/all', {headers: {name: 'lol', token: 'love'}})
		.then((ret) => {dispatch({ type: GET_USERS, payload: ret.data })})
		.catch((err) => console.log(err));*/
	};
};

export const registerUser = (name: string) => {
	return (dispatch: any) => {
		/*axios.post("http://" + window.location.hostname + ":3001/" + 'clients/register/' + name);
		return axios.get("http://" + window.location.hostname + ":3001/" + 'clients/all', {headers: {name: 'lol', token: 'love'}})
		.then((ret) => {dispatch({ type: GET_USERS, payload: ret.data })})
		.catch((err) => console.log(err));*/
	};
};

export const updateUser = (id: number, dataCli: any) => {
	return (dispatch: any) => {
		/*axios.patch("http://" + window.location.hostname + ":3001/" + 'clients/update/' + id, dataCli);
		return axios.get("http://" + window.location.hostname + ":3001/" + 'clients/all', {headers: {name: 'lol', token: 'love'}})
		.then((ret) => {dispatch({ type: GET_USERS, payload: ret.data })})
		.catch((err) => console.log(err));*/
	};
};
