import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from "react-router";
import { Route, Routes } from 'react-router-dom';
import { SocketContext } from '../../app/context/socket';
import { Packet, PacketInTypes, PacketPlayInFriendsUpdate, PacketPlayInUserConnection, PacketPlayInUserDisconnected, PacketPlayInUserUpdate } from '../../app/packets';
import { addOnlineUser, removeOnlineUser, setFriends, updateUser } from '../../app/slices/usersSlice';
import Alert from '../components/Alert';
import { Loader } from '../components/Loader';
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
	const socket = useContext(SocketContext);

	const dispatch: Dispatch<AnyAction> = useDispatch();

	console.log('-------- fresh --------');

	useEffect(() => {
		const online = (packet: PacketPlayInUserConnection) => {
			for (const user of packet.users)
				dispatch(addOnlineUser(user));
		}

		const offline = (packet: PacketPlayInUserDisconnected) => {
			dispatch(removeOnlineUser(packet.user));
		}

		const update = (packet: PacketPlayInUserUpdate) => {
			dispatch(updateUser(packet.user));
		}

		const friends = (packet: PacketPlayInFriendsUpdate) => {
			dispatch(setFriends(packet.friends));
		}

		socket?.off('user').on('user',    (packet: Packet) => {
			if (packet.packet_id === PacketInTypes.USER_CONNECTION)
				online(packet as PacketPlayInUserConnection);
			if (packet.packet_id === PacketInTypes.USER_DISCONNECTED)
				offline(packet as PacketPlayInUserDisconnected);
			if (packet.packet_id === PacketInTypes.USER_UPDATE)
				update(packet as PacketPlayInUserUpdate);
			if (packet.packet_id === PacketInTypes.FRIENDS_UPDATE)
				friends(packet as PacketPlayInFriendsUpdate);
		});

		return () => {
			socket?.off('already-online');
			socket?.off('friends');
			socket?.off('online');
			socket?.off('offline');
			socket?.off('update-user');
		}
	}, [socket, dispatch]);

	return (
		<>
			<Alert />
			<Navigation />
			<Loader />
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
