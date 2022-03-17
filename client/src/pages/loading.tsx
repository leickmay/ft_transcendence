import React, { useEffect } from "react";

export const getAuthCode = () => {
	const str: string[] = window.location.href.split("=");
	return str[1];
};

//const code = getAuthCode();

async function getCode() {
	const str: string[] = window.location.href.split("=");
}

const formData = (body: { [key: string] : string}) => {
	const form = new FormData()
		for (let key in body) {
			form.append(key, body[key])
		}
		return form;
}

async function wait() {
	
	let pouic = formData({
		grant_type: "authorization_code",
		client_id: "32e445666f212da52b3a7811bf1ff13d37cfb105f4870eb38365337172af351a",
		client_secret: "dfe506a4d179da98961261974e2ccb7dbc23f131de64890281224d8d75d78783",
		redirect_uri: "http://127.0.0.1:3000/loading",
	})
	//await new Promise((resolve, reject) => setTimeout(resolve, 3000));
	console.log(pouic.getAll('grant_type'));

}


async function sendCode() {

	const code = getAuthCode();
	let ret;
	/*fetch("/api/users/code/" + code, {method: "POST"})
		.then((res) => {
			return res.text()

		})
		.then((res) => {
			console.log(res);
			ret = res;
		})*/
		ret = await fetch("/api/users/code/" + code, {method: "POST"});
		ret = await ret.text();

		console.log("does it work BG dylan jtm ? ", ret);
		

	
	//console.log("ret du back : ", ret);

	//console.log("yoyoyoyo");

	/*const base_url = "https://api.intra.42.fr/oauth/token"
	console.log('code', code);
	let tonq = formData({
		grant_type: "authorization_code",
		client_id: "32e445666f212da52b3a7811bf1ff13d37cfb105f4870eb38365337172af351a",
		client_secret: "dfe506a4d179da98961261974e2ccb7dbc23f131de64890281224d8d75d78783",
		redirect_uri: "http://127.0.0.1:3000/loading",
		code: code
	})
	const monq = {
		method: "post",
		body: tonq,
	}
	let ret : any;
	ret = await fetch(base_url, monq);
	let tmp: any = await ret.json();
	console.log("token : ", tmp['access_token']);

	return tmp['access_token'];*/

}

//const request = fetch("/api/users/code/" + code, {method: "POST"});



export function Loading() {

	//sendCode();

	//wait();
	let retour;
	
	useEffect(() => {
		sendCode()
			//.then((data) => token = data)
		

	}, []);
	//console.log("retour : ", token);
	return (
		<div>
			<div className="spinner-grow" role="status">
			</div>
		</div>
	);
}
