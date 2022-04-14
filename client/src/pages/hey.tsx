import { useEffect, useState } from 'react';
// import { tokenToString } from 'typescript';
import { useCookies } from 'react-cookie';

export function Hey() {
	const [user] = useState('');
	// const [userId, setUserId] = useState(0);
	const [cookies] = useCookies();
	// const [data, setData] = useState([]);

	useEffect(() => {
		const loadData = async () => {
			let token = await cookies.access_token;

			let options: RequestInit = {
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			};

			console.log(await (await fetch('/api/users/', options)).json());
			// const data = await user.json();
			// console.log('data : ', data);
			//let username = data.username;
			// console.log('data[0] : ', data[0]);

			//setUser(data.username);
			//setUserId(data.userId);
			// setData(data);
		}
		loadData();
	}, [cookies])

	return (
		<div>
			<h1>Hey</h1>
		</div>
	);
}
