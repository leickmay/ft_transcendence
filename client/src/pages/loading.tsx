import React, { useEffect, useState } from "react";
import { SignIn } from "../components/signin";
import { Navigate } from "react-router-dom";



export function Loading() {
	const [loading, setLoading] = useState(true);
	const [name, setname] = useState("");
	const [id, setid] = useState(0);
	const [login, setlogin] = useState("");
	const [auth, setAuth] = useState(false);
	
	let ret: any;
	let user: any;
	let code: string;

	useEffect(() => {
		const loadData = async () => {
			const str: string[] = window.location.href.split("=");
			code = str[1];
			ret = await fetch("/api/code/" + code, { method: "GET" });
	
			console.log('ret : ', ret);


			ret = await ret.json();
			console.log('ret.access_token : ', ret);
			/*user = await fetch("api/profile", {
				method: 'GET',
				headers: {
					
					authorization: "Bearer " + ret.access_token,
				}
			})*/

			/*
			user = await user.json();
			
			if (user.statusCode === 401){
				setAuth(false);
				console.log('auth = false');
			}
			else if (user.username) {
				setAuth(true);
			}
			

			console.log('User : ', user);
			setname(ret.name);
			setid(ret.id42);
			setlogin(user.username);
			console.log(name);*/
			setLoading((loading) => !loading);
		};
		loadData();
	}, []);

	if (loading) {
		return (
			<div>
				<div className="spinner-grow" role="status"></div>
			</div>
		);
	} else {
		//if (auth) {
			return (
					<Navigate to="/hey"/>
				);
			/*return(
				<div>
					<h1>Hey {user.username} !</h1>
				</div>
			)*/
		}
		//else {
			//<Navigate to="/home" />
		//	<h1>C'est dead</h1>
		//}
		
	//}
}
