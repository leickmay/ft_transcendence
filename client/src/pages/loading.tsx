import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUserById } from "../redux/actions/user.actions";
import { useCookies } from "react-cookie";

export function Loading() {
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.userReducer);

	const [cookies, setCookies] = useCookies();

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		const str: string[] = window.location.href.split('=');
		const code: string = str[1];
		
		let token = await cookies.access_token;
		if (token)
		{
			let pouic = await fetch("api/profile", {
				method: "GET",
				headers: {
					authorization: "Bearer " + token.access_token,
				}
			});
			let data = await pouic.json();
			//console.log("data ", data, " token ", token.access_token);
			dispatch(getUserById(data.userId, token.access_token));
		}
	}

	if (!user) {
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