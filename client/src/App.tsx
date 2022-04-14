import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Hey } from './pages/hey';
import { Home } from './pages/home';
import { Loading } from './pages/loading';
import { io, Socket } from 'socket.io-client';
import './App.scss';

export default function App() {
	const [cookies] = useCookies();

	useEffect(() => {
		const startSockets = async () => {
			let token = await cookies.access_token;
		
			const socket: Socket = io('http://localhost:3001', {
				extraHeaders: {
					'Authorization': 'Bearer ' + token,
				}
			});
		
			socket.emit('increment', {num: 0});
			
			socket.on('increment', data => {
				console.log(data.num);
				// socket.emit('increment', {num: ++data.num});
			});
		}
		startSockets();
	}, []);

	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/loading" element={<Loading />} />
					<Route path="/hey" element={<Hey />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}
