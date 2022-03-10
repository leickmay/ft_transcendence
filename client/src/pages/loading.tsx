import React from "react";

export const getAuthCode = () => {
	const str: string[] = window.location.href.split("=");
	return str[1];
};

const code = getAuthCode();

const request = fetch("/api/users/code/" + code, {method: "POST"});

export function Loading() {
	console.log(code);
	return (
		<div>
			<div className="spinner-grow" role="status">
			</div>
		</div>
	);
}
