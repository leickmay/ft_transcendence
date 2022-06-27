import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { GameContext } from '../../app/context/GameContext';
import { SocketContext } from '../../app/context/SocketContext';
import { logout } from '../../app/Helpers';
import { Ball, Player } from '../../app/interfaces/Game.interface';
import { User } from '../../app/interfaces/User';
import { resetGame } from '../../app/slices/gameSlice';
import { setCurrentUser } from '../../app/slices/usersSlice';
import { RootState } from '../../app/store';
import { Home } from '../layouts/Home';

interface Props {
}

export function Connected(props: Props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const ready = useSelector((state: RootState) => state.socket.ready);
	const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
	const [socket, setSocket] = useState<Socket>();

	let [players, setPlayers] = useState<Array<Player>>([]);
	let [balls, setBalls] = useState<Array<Ball>>([]);

	useEffect(() => {
		if (!ready) {
			setPlayers([]);
			setBalls([]);
			dispatch(resetGame());
		}
	}, [ready, dispatch]);

	useEffect(() => {
		const connect = async (): Promise<void> => {
			const headers: HeadersInit = {
				'Authorization': 'Bearer ' + cookies.access_token,
				'Content-Type': 'application/json',
			};
			let res: Response = await fetch('/api/users', { headers });

			let data: any = await res.json();
			if (data.totp_validation) {
				res = await fetch('/api/login/totp', { method: 'POST', credentials: 'include', headers, body: JSON.stringify({ token: prompt('Double authentification token :') }) });
				if (res.ok) {
					setCookie('access_token', await res.text(), { secure: true, sameSite: 'lax' });
					return;
				}
			}
			if (!res.ok) {
				logout(removeCookie, navigate, socket);
				throw res.statusText;
			}

			let user: User = data;
			dispatch(setCurrentUser(user));

			let instance = io(':3001', {
				extraHeaders: headers as any,
			});
			instance.on('ready', () => {
				dispatch({ type: 'socket/ready', payload: true });
			});
			instance.on('error', (e: any) => {
				if (e.status === 401) {
					navigate('/login');
				}
			});
			instance.on('disconnect', () => {
				dispatch({ type: 'socket/ready', payload: false });
			});
			setSocket(instance);
		}

		if (!socket) {
			connect().catch(() => navigate('/login'));
		}
	}, [socket, dispatch, navigate, setCookie, removeCookie, cookies.access_token]);

	return (
		<GameContext.Provider value={{ players, setPlayers, balls, setBalls }}>
			<SocketContext.Provider value={socket}>
				<Home />
			</SocketContext.Provider>
		</GameContext.Provider>
	);
}
