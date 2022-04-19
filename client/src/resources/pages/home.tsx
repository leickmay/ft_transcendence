import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from "react-router";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { fetchCurrentUser } from '../../app/actions/usersActions';
import { SocketContext } from '../../app/context/socket';
import { RootState } from '../../app/store';
import { Menu } from './menu';

interface Props {
}

export function Home(props: Props) {
	const [cookies] = useCookies();
	const [socket, setSocket] = useState<Socket>();
	const navigate = useNavigate();
	const dispatch: Dispatch<AnyAction> = useDispatch();

	const getHeaders = useCallback(async () => {
		const token = await cookies.access_token;
		return {
			'Authorization': 'Bearer ' + token
		};
	}, [cookies.access_token]);

	useEffect(() => {
		
	}, [socket]);

	useEffect(() => {
		const connect = async () => {
			const headers: HeadersInit = await getHeaders();
			await dispatch(fetchCurrentUser(headers));

			const socket: Socket = io(':3001', {extraHeaders: headers as any});
			socket.on('connect', () => {
				dispatch({ type: 'socket/connected', payload: true });
			});
			socket.on('disconnect', () => {
				dispatch({ type: 'socket/connected', payload: false });
			});
			setSocket(socket);
		}

		connect()
		.catch(() => {
			navigate('/login');
		});
	}, [getHeaders]);

	return (
		<SocketContext.Provider value={socket}>
			<Routes>
				<Route path="/" element={<Menu />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</SocketContext.Provider>
	);
}
