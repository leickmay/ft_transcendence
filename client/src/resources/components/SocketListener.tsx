import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/socket';
import { ChatRoom, Command } from '../../app/interfaces/Chat';
import { User } from '../../app/interfaces/User';
import { PacketPlayInChatInit, PacketPlayInChatMessage, PacketPlayInChatRoomCreate } from '../../app/packets/chat/PacketPlayInChat';
import { PacketPlayInFriendsUpdate } from '../../app/packets/PacketPlayInFriendsUpdate';
import { PacketPlayInUserConnection } from '../../app/packets/PacketPlayInUserConnection';
import { PacketPlayInUserDisconnected } from '../../app/packets/PacketPlayInUserDisconnected';
import { PacketPlayInUserUpdate } from '../../app/packets/PacketPlayInUserUpdate';
import { PacketPlayOutFriends } from '../../app/packets/PacketPlayOutFriends';
import { Packet, PacketTypesChat, PacketTypesMisc, PacketTypesUser } from '../../app/packets/packetTypes';
import { addRoom, addUser, newMessages, setChatRooms } from '../../app/slices/chatSlice';
import { addOnlineUser, removeOnlineUser, setFriends, updateUser } from '../../app/slices/usersSlice';
import store, { RootState } from '../../app/store';

interface Props {}

export const SocketListener = (props: Props) => {
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

		const chatInMessage = (packet: PacketPlayInChatMessage) => {
			if (packet.message.cmd) {
				let cmd: string[] = packet.message.text.split(" ", 1);
				switch (cmd[0]) {
					case "/JOIN": {
						cmd[1] = packet.message.text.substring(cmd[0].length + 1);

						let user: User | undefined = store.getState().users.friends.find((x) =>
							x.login === packet.message.from
						);
						if (!user && packet.message.from === store.getState().users.current?.login)
							user = store.getState().users.current;

						if (user) {
							let command: Command = {
								user: user,
								cmd: cmd,
							}
							store.dispatch(addUser(command));
						}
						break;
					}
					default:
						break;
				}
			}
			dispatch(newMessages(packet));
		}
	
		const chatInCreate = (packet: PacketPlayInChatRoomCreate) => {
			store.dispatch(addRoom(packet))
		}

		const event_command = () => {};
		const event_message = () => {};
		const event_create = () => {};
		const event_join = () => {};
		const event_leave = () => {};
		const event_up = () => {};
		const event_init = (packet: PacketPlayInChatInit) => {
			let rooms: Array<ChatRoom> = packet.rooms as Array<ChatRoom>
			rooms.forEach((r: ChatRoom) => {r.messages = [];});
			console.log(rooms);
			store.dispatch(setChatRooms(rooms));
		};

		socket?.off('chat').on('chat', (packet: Packet) => {
			console.log(socket.id)
			console.log(packet)
			switch (packet.packet_id) {
				case PacketTypesChat.COMMAND: {
					event_command();
					break;
				}
				case PacketTypesChat.MESSAGE: {
					event_message();
					chatInMessage(packet as PacketPlayInChatMessage);
					break;
				}
				case PacketTypesChat.CREATE: {
					event_create();
					chatInCreate(packet as PacketPlayInChatRoomCreate);
					break;
				}
				case PacketTypesChat.JOIN: {
					event_join();
					break;
				}
				case PacketTypesChat.LEAVE: {
					event_leave();
					break;
				}
				case PacketTypesChat.UP: {
					event_up();
					break;
				}
				case PacketTypesChat.INIT: {
					event_init(packet as PacketPlayInChatInit);
					break;
				}
				default: {
					break;
				}
			}
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
