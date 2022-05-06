import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { SocketContext } from '../../app/context/socket';
import { logout } from '../../app/Helpers';
import { User } from '../../app/interfaces/User';
import { setCurrentUser } from '../../app/slices/usersSlice';
import { Home } from '../layouts/Home';

interface Props {
}

export function Connected(props: Props) {
	const navigate = useNavigate();

	const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
	const [socket, setSocket] = useState<Socket>();

	const dispatch: Dispatch<AnyAction> = useDispatch();

	useEffect(() => {
		const connect = async (): Promise<void> => {
			const headers: HeadersInit = {
				'Authorization': 'Bearer ' + cookies.access_token,
				'Content-Type': 'application/json',
			};
			let res: Response = await fetch('/api/users', {headers});

			let data: any = await res.json();
			console.log(-1);
			if (data.totp_validation) {
				res = await fetch('/api/totp', {method: 'POST', headers, body: JSON.stringify({token: prompt('Double authentification token :')})});
				console.log(0);
				if (res.ok) {
					setCookie('access_token', await res.text());
					console.log(1);
					
					return;
				}
			}
			if (!res.ok) {
				logout(removeCookie, navigate);
				throw res.statusText;
			}

			let user: User = data;
			dispatch(setCurrentUser(user));

			let instance = io(':3001', {extraHeaders: headers as any});
			instance.on('connect', () => {
				dispatch({ type: 'socket/connected', payload: true });
			});
			instance.on('error', (e: any) => {
				if (e.status === 401)
					navigate('/login');
			});
			instance.on('disconnect', () => {
				dispatch({ type: 'socket/connected', payload: false });
			});
			setSocket(instance);
		}

		if (!socket) {
			connect().catch(() => navigate('/login'))
		}
	}, [socket, dispatch, navigate, setCookie, removeCookie, cookies.access_token]);

	useEffect(() => {
		return () => {
			socket?.close();
		};
	}, [socket]);

	return (
		<SocketContext.Provider value={socket}>
			<Home />
		</SocketContext.Provider>
	);
}
