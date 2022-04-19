import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { useCallback, useEffect, useState } from 'react';
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

	const getHeaders = useCallback(async () => {
		const token = await cookies.access_token;
		return {
			'Authorization': 'Bearer ' + token
		};
	}, [cookies.access_token]);

	useEffect(() => {
		const connect = async () => {
			const headers: HeadersInit = await getHeaders();
			await dispatch(fetchCurrentUser(headers));

			const instance: Socket = io(':3001', {extraHeaders: headers as any});
			instance.on('connect', () => {
				dispatch({ type: 'socket/connected', payload: true });
			});
			instance.on('disconnect', () => {
				dispatch({ type: 'socket/connected', payload: false });
			});
			setSocket(instance);
		}

		connect()
		.catch(() => {
			navigate('/login');
		});
	}, [dispatch, navigate, getHeaders]);

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
