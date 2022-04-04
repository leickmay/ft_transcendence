import axios from "axios"


export const GET_USER = "GET_USER";

export const getUser = (name: string) => {
	
	return (dispatch: any) => {

		
		/*return axios.get("http://" + window.location.hostname + ":3001/" + 'clients/one/' + name)
		.then((ret) => {dispatch({ type: GET_USER, payload: ret.data })})
		.catch((err) => {dispatch({ type: GET_USER, payload: null })});*/
	};
};


export const getUserById = (id: number, token: string) => {
	
	return (dispatch: any) => {

		fetch("api/users/" + id, {
			method: "GET",
			headers: {
				authorization: "Bearer " + token,
			}
		}).then((ret) => {dispatch({ type: GET_USER, payload: ret.json() })})
		.catch((err) => {dispatch({ type: GET_USER, payload: null })});
		
		/*return axios.get("http://" + window.location.hostname + ":3001/" + 'clients/one/' + name)
		.then((ret) => {dispatch({ type: GET_USER, payload: ret.data })})
		.catch((err) => {dispatch({ type: GET_USER, payload: null })});*/
	};
};

export const getProfile = (token: string) => {
	
	return (dispatch: any) => {

		fetch("api/profile", {
			method: "GET",
			headers: {
				authorization: "Bearer " + token,
			}
		}).then((ret) => {dispatch({ type: GET_USER, payload: ret.json() })})
		.catch((err) => {dispatch({ type: GET_USER, payload: null })});
		/*return axios.get("http://" + window.location.hostname + ":3001/" + 'clients/one/' + name)
		.then((ret) => {dispatch({ type: GET_USER, payload: ret.data })})
		.catch((err) => {dispatch({ type: GET_USER, payload: null })});*/
	};
};