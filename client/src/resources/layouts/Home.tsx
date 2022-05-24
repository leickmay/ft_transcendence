import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from "react-router";
import { Route, Routes } from 'react-router-dom';
import { SocketContext } from '../../app/context/socket';
import { PacketPlayOutFriends } from '../../app/packets';
import { PacketPlayInFriendsUpdate } from '../../app/packets/PacketPlayInFriendsUpdate';
import { PacketPlayInUserConnection } from '../../app/packets/PacketPlayInUserConnection';
import { PacketPlayInUserDisconnected } from '../../app/packets/PacketPlayInUserDisconnected';
import { PacketPlayInUserUpdate } from '../../app/packets/PacketPlayInUserUpdate';
import { PacketTypesMisc, Packet, PacketTypesUser } from '../../app/packets/packetTypes';
import { addOnlineUser, removeOnlineUser, setFriends, updateUser } from '../../app/slices/usersSlice';
import { RootState } from '../../app/store';
import Alert from '../components/Alert';
import { Loader } from '../components/Loader';
import Navigation from '../components/Navigation';
import { Chat } from '../pages/Chat';
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
	const ready = useSelector((state: RootState) => state.socket.ready);

	const dispatch: Dispatch<AnyAction> = useDispatch();

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

		socket?.off('user').on('user', (packet: Packet) => {
			if (packet.packet_id === PacketTypesUser.USER_CONNECTION)
				online(packet as PacketPlayInUserConnection);
			if (packet.packet_id === PacketTypesUser.USER_DISCONNECTED)
				offline(packet as PacketPlayInUserDisconnected);
			if (packet.packet_id === PacketTypesUser.USER_UPDATE)
				update(packet as PacketPlayInUserUpdate);
			if (packet.packet_id === PacketTypesMisc.FRIENDS)
				friends(packet as PacketPlayInFriendsUpdate);
		});

		socket?.off('chat').on('chat', (packet: Packet) => {
			console.log(packet);
		});
	}, [socket, dispatch]);
	
	useEffect(() => {
		if (ready)
			socket?.emit('user', new PacketPlayOutFriends('get'));
	}, [socket, ready]);

	return (
		<>
			<Alert />
			<Navigation />
			<Loader />
			<Routes>
				<Route path="/" element={<Menu />} />
				<Route path="/game" element={<Game />} />
				<Route path="/friends" element={<Friends />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="/statistics" element={<Statistics />} />
				<Route path="/history" element={<History />} />
				<Route path="/options" element={<Options />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</>
	);
}
