import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from "react-router";
import { Route, Routes } from 'react-router-dom';
import { SocketContext } from '../../app/context/socket';
import { UpdateUserDto, User } from '../../app/interfaces/User';
import { addOnlineUser, removeOnlineUser, setFriends, setOnlineUsers, updateUser } from '../../app/slices/usersSlice';
import { RootState } from '../../app/store';
import Alert from '../components/Alert';
import Navigation from '../components/Navigation';
import { Friends } from '../pages/Friends';
import { Game } from '../pages/Game';
import { History } from '../pages/History';
import { Menu } from '../pages/Menu';
import { Options } from '../pages/Options';
import { Statistics } from '../pages/Statistics';

interface Props {
}

export function Home(props: Props) {
	const [loadingElement, setLoadingElement] = useState<ReactElement>();

	const connected = useSelector((state: RootState) => state.socket.connected);

	const socket = useContext(SocketContext);

	const dispatch: Dispatch<AnyAction> = useDispatch();

	useEffect(() => {
		if (!connected) {
			setLoadingElement(<div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}><div className="spinner-grow" role="status"></div></div>);
		} else {
			socket?.emit('friend', { action: 'get' });
			setLoadingElement(undefined);
		}
	}, [connected]);

	useEffect(() => {
		socket?.on('already-online', (data: Array<User>)   => { dispatch(setOnlineUsers(data)); });
		socket?.on('friends',        (data: Array<User>)   => { dispatch(setFriends(data)); });
		socket?.on('online',         (data: User)          => { dispatch(addOnlineUser(data)); });
		socket?.on('offline',        (data: User)          => { dispatch(removeOnlineUser(data)); });
		socket?.on('update-user',    (data: UpdateUserDto) => { dispatch(updateUser(data)); });

		return () => {
			socket?.off('online');
			socket?.off('offline');
			socket?.off('online-users');
		}
	}, [socket, dispatch]);

	return (
		<>
			<Alert />
			<Navigation />
			{ loadingElement }
			<Routes>
				<Route path="/" element={<Menu />} />
				<Route path="/game" element={<Game />} />
				<Route path="/friends" element={<Friends />} />
				<Route path="/statistics" element={<Statistics />} />
				<Route path="/history" element={<History />} />
				<Route path="/options" element={<Options />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</>
	);
}
