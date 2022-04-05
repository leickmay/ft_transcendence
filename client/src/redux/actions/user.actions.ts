import axios from "axios"


export const GET_USER = "GET_USER";
export const GET_USER_BY_ID = "GET_USER_BY_ID";
export const GET_PROFILE = "GET_PROFILE";

export const getUser = (name: string) => {
	
	return (dispatch: any) => {

		
		/*return axios.get("http://" + window.location.hostname + ":3001/" + 'clients/one/' + name)
		.then((ret) => {dispatch({ type: GET_USER, payload: ret.data })})
		.catch((err) => {dispatch({ type: GET_USER, payload: null })});*/
	};
};


export const getUserById = (id: number, token: string) => {
	
	return async (dispatch: any) => {

		/*let data = await fetch("api/users/" + id, {
			method: "GET",
			headers: {
				authorization: "Bearer " + token, }
			});
		console.log("getUserByID data: " + data);
		let dataJson = await data.json();
		console.log("getUserById dataJson: " + dataJson);
		return dispatch({ type: GET_USER_BY_ID, payload: dataJson });*/

		return fetch("api/users/" + id, {
				method: "GET",
				headers: {
					authorization: "Bearer " + token, }
			}).then(req => req.json())
			.then(data => {dispatch({ type: GET_USER_BY_ID, payload: data })})
			.catch((err) => {dispatch({ type: GET_USER_BY_ID, payload: null })});

		/*return axios.get("http://" + window.location.hostname + ":3001/" + 'clients/one/' + name)
		.then((ret) => {dispatch({ type: GET_USER, payload: ret.data })})
		.catch((err) => {dispatch({ type: GET_USER, payload: null })});*/
	};
};

export const getProfile = (token: string) => {
	
	return async (dispatch: any) => {

		/*let data = await fetch("api/profile", {
			method: "GET",
			headers: {
				authorization: "Bearer " + token,
			}
		});
		console.log("getProfile data: " + data);
		let dataJson = await data.json();
		console.log("getProfile dataJson: " + dataJson);
		return dispatch({ type: GET_PROFILE, payload: dataJson });*/

		return fetch("api/profile", {
			method: "GET",
			headers: {
				authorization: "Bearer " + token,
			}
		}).then(req => req.json())
		.then(data => {console.log(data), dispatch({ type: GET_PROFILE, payload: data })})
		.catch((err) => {dispatch({ type: GET_PROFILE, payload: null })});

		/*return axios.get("http://" + window.location.hostname + ":3001/" + 'clients/one/' + name)
		.then((ret) => {dispatch({ type: GET_USER, payload: ret.data })})
		.catch((err) => {dispatch({ type: GET_USER, payload: null })});*/
	};
};