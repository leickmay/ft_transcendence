import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { fetchCurrentUser } from '../../app/actions/usersActions';
import { SocketContext } from '../../app/context/socket';
import { Home } from '../layouts/Home';

interface Props {
}

export function Connected(props: Props) {
	const navigate = useNavigate();

	const [cookies] = useCookies();
	const [socket, setSocket] = useState<Socket>();

	const dispatch: Dispatch<AnyAction> = useDispatch();

	useEffect(() => {
		const connect = async () => {
			const headers: HeadersInit = {
				'Authorization': 'Bearer ' + await cookies.access_token
			};
			await dispatch(fetchCurrentUser(headers));

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
	}, [socket, dispatch, navigate, cookies.access_token]);

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
