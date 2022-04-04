import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getProfile, getUserById } from "../redux/actions/user.actions";
import { useCookies } from "react-cookie";
import { TIMEOUT } from "dns";

export function Loading() {
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.userReducer);
	const [loading, setLoading] = useState(true);

	const [cookies, setCookies] = useCookies();

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		const str: string[] = window.location.href.split('=');
		const code: string = str[1];
		let ret = await fetch("api/code/" + code, {method: "GET"});

		console.log('ret : ', ret);
		
		let token = await cookies.access_token;
		if (token)
		{
			let pouic = await fetch("api/profile", {
				method: "GET",
				headers: {
					authorization: "Bearer " + token.access_token,
				}
			});
			console.log("pouic : ", pouic.json());
			dispatch(getProfile(token.access_token))
			console.log("user " + user);

			//await new Promise(resolve => setTimeout(resolve, 5000));
			let id = user.id42;
			dispatch(getUserById(id, token.access_token));
		}
		console.log("token cookie : ", token.access_token);
		setLoading((loading) => !loading);
	}

	if (loading) {
		return (
			<div>Chargement en cours</div>
		);
	}

	else {
		return (
			<Navigate to="/home" />
		);
	}
}