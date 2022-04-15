import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Hey } from './pages/hey';
import { Home } from './pages/home';
import { Loading } from './pages/loading';
import { io, Socket } from 'socket.io-client';
import './App.scss';

export default function App() {
	const [user] = useState();
	const [cookies] = useCookies();

	useEffect(() => {
		const startSockets = async () => {
			let token = await cookies.access_token;

			let options: RequestInit = {
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			};

			setState
			// await (await fetch('/api/users/', options)).json();

			const socket: Socket = io('http://localhost:3001', {
				extraHeaders: {
					'Authorization': 'Bearer ' + token,
				},
			});
		}
		startSockets();
	}, [cookies]);

	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/loading" element={<Loading />} />
					<Route path="/hey" element={<Hey />} />
					<img>{{ user.id }}</img>
				</Routes>
			</BrowserRouter>
		</div>
	);
}
