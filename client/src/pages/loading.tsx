import React, { useEffect, useState } from "react";


export function Loading() {
	const [loading, setLoading] = useState(true);
	const [name, setname] = useState("");
	const [id, setid] = useState(0);
	const [login, setlogin] = useState("");
	const [avatar, setavatar] = useState("");
	
	let ret: any;
	let code: string;

	useEffect(() => {
		const loadData = async () => {
			const str: string[] = window.location.href.split("=");
			code = str[1];
			ret = await fetch("/api/users/code/" + code, { method: "POST" });
			console.log('ret : ', ret);

			ret = await ret.json();
			console.log('ret2 : ', ret);
			setname(ret.name);
			setid(ret.id42);
			setlogin(ret.login);
			setavatar(ret.avatar);
			console.log(name);
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
		return (
			<div className="coucou">
				<h1>Hey {name} !!!</h1>
				<h2>Ton id 42 est {id}, ton login {login}</h2>
			</div>
			);
	}
}
