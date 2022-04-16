import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { io, Socket } from 'socket.io-client';

interface User {
	id: number,
	id42: string,
	login: string,
	name: string,
	avatar: string,
}

interface Props {
}

export function Menu(props: Props) {
	const [user, setUser] = useState<User>();
	const [cookies] = useCookies();
	const navigate = useNavigate();

	useEffect(() => {
		const getHeaders = async () => {
			const token = await cookies.access_token;
	
			return {
				'Authorization': 'Bearer ' + token
			};
		};
	
		const getUser = async (): Promise<User> => {
			const options: RequestInit = {headers: await getHeaders()};
	
			let res = await fetch('/api/users/', options);
			if (!res.ok)
				throw new Error('not logged in');
			return await res.json();
		};
	
		const startSockets = async (): Promise<Socket> => {
			return io('http://localhost:3001', {extraHeaders: await getHeaders()});
		}

		getUser()
		.then(user => setUser(() => user))
		.catch(() => navigate('/login'));

		startSockets();
	}, [navigate, cookies.access_token]);

	return (
		<p>{ user?.login || "Loading..." }</p>
	);
}
