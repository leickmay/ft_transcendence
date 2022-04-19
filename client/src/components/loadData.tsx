import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUserById } from "../redux/actions/user.actions";
import { useCookies } from "react-cookie";

export async function loadData() {
	const str: string[] = window.location.href.split('=');
	const code: string = str[1];
	const [cookies, setCookies] = useCookies();
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.userReducer);
	
	if (!cookies.access_token)
		await fetch("/api/code/" + code, { method: "GET" });

	let token = await cookies.access_token;
	console.log("token: ", await cookies.access_token);
	
	if (token)
	{
		let pouic = await fetch("api/profile", {
			method: "GET",
			headers: {
				authorization: "Bearer " + token.access_token,
			}
		});
		let data = await pouic.json();
		dispatch(getUserById(data.userId, token.access_token));
		console.log("user: ", user);
		
	}
	else
	{
		window.location.reload();
	}

  };
