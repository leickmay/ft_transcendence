import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/socket';
import { PacketPlayInFriendsUpdate } from '../../app/packets/PacketPlayInFriendsUpdate';
import { PacketPlayInGameUpdate } from '../../app/packets/PacketPlayInGameUpdate';
import { PacketPlayInPlayerJoin } from '../../app/packets/PacketPlayInPlayerJoin';
import { PacketPlayInPlayerList } from '../../app/packets/PacketPlayInPlayerList';
import { PacketPlayInPlayerReady } from '../../app/packets/PacketPlayInPlayerReady';
import { PacketPlayInUserConnection } from '../../app/packets/PacketPlayInUserConnection';
import { PacketPlayInUserDisconnected } from '../../app/packets/PacketPlayInUserDisconnected';
import { PacketPlayInUserUpdate } from '../../app/packets/PacketPlayInUserUpdate';
import { PacketPlayOutFriends } from '../../app/packets/PacketPlayOutFriends';
import { Packet, PacketTypesGame, PacketTypesMisc, PacketTypesPlayer, PacketTypesUser } from '../../app/packets/packetTypes';
import { addPlayer, setPlayerReady, setPlayers, updateGame } from '../../app/slices/gameSlice';
import { addOnlineUser, removeOnlineUser, setFriends, updateUser } from '../../app/slices/usersSlice';
import { RootState } from '../../app/store';

interface Props {}

export const SocketListener = (props: Props) => {
	const socket = useContext(SocketContext);
	const ready = useSelector((state: RootState) => state.socket.ready);

	const dispatch = useDispatch();

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
			switch (packet.packet_id) {
				case PacketTypesUser.CONNECTION:
					online(packet as PacketPlayInUserConnection);
					break;
				case PacketTypesUser.DISCONNECTED:
					offline(packet as PacketPlayInUserDisconnected);
					break;
				case PacketTypesUser.UPDATE:
					update(packet as PacketPlayInUserUpdate);
					break;
				case PacketTypesMisc.FRIENDS:
					friends(packet as PacketPlayInFriendsUpdate);
					break;
				default:
					break;
			}
		});
	}, [socket, dispatch]);

	useEffect(() => {
		socket?.off('game').on('game', (packet: Packet): void => {
			const gameUpdate = (packet: PacketPlayInGameUpdate) => {
				dispatch(updateGame(packet.data));
			}

			const playerList = (packet: PacketPlayInPlayerList) => {
				dispatch(setPlayers(packet.players));
			}

			const playerJoin = (packet: PacketPlayInPlayerJoin) => {
				dispatch(addPlayer(packet.player));
			}

			// const remove = (packet: PacketPlayInPlayerLeave) => {
			// 	dispatch(removePlayer(packet.player));
			// }

			const playerReady = (packet: PacketPlayInPlayerReady) => {
				dispatch(setPlayerReady(packet.player));
			}

			switch (packet.packet_id) {
				case PacketTypesPlayer.LIST:
					playerList(packet as PacketPlayInPlayerList);
					break;
				case PacketTypesPlayer.JOIN:
					playerJoin(packet as PacketPlayInPlayerJoin);
					break;
				case PacketTypesPlayer.READY:
					playerReady(packet as PacketPlayInPlayerReady);
					break;
				case PacketTypesGame.UPDATE:
					gameUpdate(packet as PacketPlayInGameUpdate);
					break;
				default:
					break;
			}
		});
	}, [socket, dispatch]);

	useEffect(() => {
		socket?.off('chat').on('chat', (packet: Packet) => {
			console.log(packet);
		});
	}, [socket, dispatch]);

	useEffect(() => {
		if (ready)
			socket?.emit('user', new PacketPlayOutFriends('get'));
	}, [socket, ready]);

	return (
		<></>
	);
};
