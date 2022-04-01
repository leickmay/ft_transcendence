import React, { useEffect, useState } from "react";
import { tokenToString } from "typescript";
import { SignIn } from "../components/signin";
import { useCookies } from "react-cookie";

export function Hey() {
	const [user, setUser] = useState({});
	const [cookies, setCookies] = useCookies();

	useEffect(() => {
		const loadData = async () => {
			let token = await cookies.access_token;
			console.log("token cookie : ", token.access_token);
			let user = await fetch("api/profile", {
				method: 'GET',
				headers: {
					authorization: "Bearer " + token.access_token,
					}
			})
			console.log('user :', user);
		}
		loadData();
	}, [])
	


	return <h1>Hey !</h1>;
}
