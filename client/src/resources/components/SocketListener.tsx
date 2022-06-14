import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/socket';
import { ChatRoom, ChatTypes, Command } from '../../app/interfaces/Chat';
import { User } from '../../app/interfaces/User';
import { PacketPlayInChatDel, PacketPlayInChatInit, PacketPlayInChatMessage, PacketPlayInChatRoomCreate, PacketPlayInChatUp } from '../../app/packets/chat/PacketPlayInChat';
import { PacketPlayInFriendsUpdate } from '../../app/packets/PacketPlayInFriendsUpdate';
import { PacketPlayInUserConnection } from '../../app/packets/PacketPlayInUserConnection';
import { PacketPlayInUserDisconnected } from '../../app/packets/PacketPlayInUserDisconnected';
import { PacketPlayInUserUpdate } from '../../app/packets/PacketPlayInUserUpdate';
import { PacketPlayOutFriends } from '../../app/packets/PacketPlayOutFriends';
import { Packet, PacketTypesChat, PacketTypesMisc, PacketTypesUser } from '../../app/packets/packetTypes';
import { addRoom, addUser, delRoom, leaveRoom, newMessages, setChatRooms} from '../../app/slices/chatSlice';
import { addOnlineUser, removeOnlineUser, setFriends, updateUser } from '../../app/slices/usersSlice';
import store, { RootState } from '../../app/store';
import { getRoomById, getUserByLogin } from '../pages/Chat';

interface Props {}

export const SocketListener = (props: Props) => {
	const socket = useContext(SocketContext);
	const ready = useSelector((state: RootState) => state.socket.ready);

	const currentUser = useSelector((state: RootState) => state.users.current);
	const rooms = useSelector((state: RootState) => state.chat.rooms);

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
	
		const chatInCreate = (packet: PacketPlayInChatRoomCreate) => {
			store.dispatch(addRoom(packet))
		}

		const commandHandler = async () => {};
		const messageHandler = async (packet: PacketPlayInChatMessage) => {
			if (packet.message.cmd) {
				let cmd: string[] = packet.message.text.split(" ", 1);
				switch (cmd[0]) {
					case "/JOIN": {
						cmd[1] = packet.message.text.substring(cmd[0].length + 1);
						let user: User | undefined = getUserByLogin(packet.message.from);
						let room: ChatRoom | undefined = getRoomById(packet.room);
						if (user && room) {
							let command: Command = {
								user: user,
								room: packet.room,
								cmd: cmd,
							};
							store.dispatch(addUser(command));
						}
						break;
					}
					case "/EXIT": {
						let user: User | undefined = getUserByLogin(packet.message.from);
						let room: ChatRoom | undefined = rooms?.find(x => x.id === packet.room);
						if (user && room) {
							let command: Command = {
								user: user,
								room: room.id,
								cmd: cmd,
							};
							store.dispatch(leaveRoom(command));
							if (room.users.length === 1 || room.type === ChatTypes.PRIVATE_MESSAGE) {
								store.dispatch(delRoom(room));
							}
							if (room.users.length >= 2 && room.type === ChatTypes.CHANNEL) {
								//store.dispatch() SET NEW OPERATOR
							}
						}
						break;
					}
					default:
						break;
				}
			}
			dispatch(newMessages(packet));
		};
		const createHandler = async () => {};
		const joinHandler = async () => {};
		const leaveHandler = async () => {};
		const upHandler = async (packet: PacketPlayInChatUp) => {
		};
		const initHandler = async (packet: PacketPlayInChatInit) => {
			let rooms: Array<ChatRoom> = packet.rooms as Array<ChatRoom>
			rooms.forEach((r: ChatRoom) => {r.messages = [];});
			store.dispatch(setChatRooms(rooms));
		};
		const delHandler = async (packet: PacketPlayInChatDel) => {
			store.dispatch(delRoom(packet.room as ChatRoom));
		};

		socket?.off('chat').on('chat', (packet: Packet) => {
			console.log(socket.id)
			console.log(packet)
			switch (packet.packet_id) {
				case PacketTypesChat.COMMAND: {
					commandHandler();
					break;
				}
				case PacketTypesChat.MESSAGE: {
					messageHandler(packet as PacketPlayInChatMessage);
					break;
				}
				case PacketTypesChat.CREATE: {
					createHandler();
					chatInCreate(packet as PacketPlayInChatRoomCreate);
					break;
				}
				case PacketTypesChat.JOIN: {
					joinHandler();
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
