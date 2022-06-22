import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { receiveMessage } from '../../app/actions/messageActions';
import { SocketContext } from '../../app/context/socket';
import { ChatRoom, ChatTypes } from '../../app/interfaces/Chat';
import { User } from '../../app/interfaces/User';
import { PacketPlayInChatAdmin, PacketPlayInChatBlock, PacketPlayInChatDel, PacketPlayInChatInit, PacketPlayInChatJoin, PacketPlayInChatMessage, PacketPlayInChatOwner, PacketPlayInChatRoomCreate, PacketPlayInChatUp } from '../../app/packets/chat/PacketPlayInChat';
import { PacketPlayInFriendsUpdate } from '../../app/packets/PacketPlayInFriendsUpdate';
import { PacketPlayInLeaderboard } from '../../app/packets/PacketPlayInLeaderboard';
import { PacketPlayInStatsUpdate } from '../../app/packets/PacketPlayInStatsUpdate';
import { PacketPlayInUserConnection } from '../../app/packets/PacketPlayInUserConnection';
import { PacketPlayInUserDisconnected } from '../../app/packets/PacketPlayInUserDisconnected';
import { PacketPlayInUserUpdate } from '../../app/packets/PacketPlayInUserUpdate';
import { PacketPlayOutFriends } from '../../app/packets/PacketPlayOutFriends';
import { Packet, PacketTypesChat, PacketTypesMisc, PacketTypesUser } from '../../app/packets/packetTypes';
import { addRoom, addUserToRoom, delRoom, leaveRoom, setAdmins, setChatRooms, setOwner, upUsersBlocked } from '../../app/slices/chatSlice';
import { setBoard } from '../../app/slices/leaderboardSlice';
import { setUserStats } from '../../app/slices/statsSlice';
import { addOnlineUser, removeOnlineUser, setFriends, updateUser } from '../../app/slices/usersSlice';
import { RootState } from '../../app/store';
import { getUserByLogin } from '../pages/Chat';

interface Props { }

export const SocketListener = (props: Props) => {
	const socket = useContext(SocketContext);
	const ready = useSelector((state: RootState) => state.socket.ready);

	const currentUser = useSelector((state: RootState) => state.users.current);
	const rooms = useSelector((state: RootState) => state.chat.rooms);

	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

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

		const stats = (packet: PacketPlayInStatsUpdate) => {
			dispatch(setUserStats(packet));
		}

		const board = (packet: PacketPlayInLeaderboard) => {
			dispatch(setBoard(packet.users));
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

		const commandHandler = async (packet: PacketPlayInChatMessage) => {
			let cmd = packet.message.text.split(" ");
			switch (cmd[0]) {
				case "/EXIT": {
					let user: User | undefined = getUserByLogin(packet.message.from);
					if (user?.id !== currentUser?.id)
						break;
					let room = rooms?.find(x => x.id === packet.room);
					if (user && room) {
						dispatch(leaveRoom({
							user: user,
							room: room.id,
							cmd: cmd,
						}));
						if (room.users.length === 1
							|| room.type === ChatTypes.PRIVATE_MESSAGE
							|| !room.visible) {
							dispatch(delRoom(room));
						}
					}
					break;
				}
				case "/BAN": {
					let user: User | undefined = getUserByLogin(cmd[1]);
					if (user === undefined)
						break;
					let room = rooms?.find(x => x.id === packet.room);
					if (user.id === currentUser?.id && room) {
						dispatch(leaveRoom({
							user: user,
							room: room.id,
							cmd: cmd,
						}));
						if (!room.visible) {
							dispatch(delRoom(room));
						}
					}
					break;
				}
				default:
					break;
			}
		};
		const messageHandler = async (packet: PacketPlayInChatMessage) => {
			if (packet.message.cmd)
				commandHandler(packet);
			dispatch(receiveMessage(packet));
		};
		const createHandler = async (packet: PacketPlayInChatRoomCreate) => {
			dispatch(addRoom(packet))
		}
		const joinHandler = async (packet: PacketPlayInChatJoin) => {
			dispatch(addUserToRoom(packet));
		};
		const leaveHandler = async () => { };
		const upHandler = async (packet: PacketPlayInChatUp) => {
		};
		const initHandler = async (packet: PacketPlayInChatInit) => {
			let rooms = packet.rooms as Array<ChatRoom>
			rooms.forEach((r: ChatRoom) => { r.messages = []; });
			dispatch(setChatRooms(rooms));
			dispatch(upUsersBlocked(packet.usersBlocked));
		};
		const delHandler = async (packet: PacketPlayInChatDel) => {
			dispatch(delRoom(packet.room as ChatRoom));
		};
		const ownerHandler = async (packet: PacketPlayInChatOwner) => {
			dispatch(setOwner(packet));
		};
		const adminHandler = async (packet: PacketPlayInChatAdmin) => {
			dispatch(setAdmins(packet));
		};
		const blockHandler = async (packet: PacketPlayInChatBlock) => {
			dispatch(upUsersBlocked(packet.usersBlocked));
		};

		socket?.off('stats').on('stats', (packet: Packet) => {
			if (packet.packet_id === PacketTypesMisc.STATS_UPDATE)
				stats(packet as PacketPlayInStatsUpdate);
			if (packet.packet_id === PacketTypesMisc.LEADERBOARD)
				board(packet as PacketPlayInLeaderboard);
		});

		socket?.off('chat').on('chat', (packet: Packet) => {
			console.log(packet.packet_id)
			switch (packet.packet_id) {
				case PacketTypesChat.MESSAGE: {
					messageHandler(packet as PacketPlayInChatMessage);
					break;
				}
				case PacketTypesChat.CREATE: {
					createHandler(packet as PacketPlayInChatRoomCreate);
					break;
				}
				case PacketTypesChat.JOIN: {
					joinHandler(packet as PacketPlayInChatJoin);
					break;
				}
				case PacketTypesChat.LEAVE: {
					leaveHandler();
					break;
				}
				case PacketTypesChat.UP: {
					upHandler(packet as PacketPlayInChatUp);
					break;
				}
				case PacketTypesChat.INIT: {
					initHandler(packet as PacketPlayInChatInit);
					break;
				}
				case PacketTypesChat.DEL: {
					delHandler(packet as PacketPlayInChatDel);
					break;
				}
				case PacketTypesChat.OWNER: {
					ownerHandler(packet as PacketPlayInChatOwner);
					break;
				}
				case PacketTypesChat.ADMIN: {
					adminHandler(packet as PacketPlayInChatAdmin);
					break;
				}
				case PacketTypesChat.BLOCK: {
					blockHandler(packet as PacketPlayInChatBlock);
					break;
				}
				default: {
					break;
				}
			}
		});
	}, [socket, dispatch, currentUser, rooms]);

	useEffect(() => {
		if (ready)
			socket?.emit('user', new PacketPlayOutFriends('get'));
	}, [socket, ready]);

	return (
		<></>
	);
};
