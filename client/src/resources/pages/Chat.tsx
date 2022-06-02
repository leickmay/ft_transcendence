import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { ChatRoom, Command } from "../../app/interfaces/Chat";
import { User } from "../../app/interfaces/User";
import { PacketPlayInChatMessage } from "../../app/packets/InChat/PacketPlayInChatMessage";
import { PacketPlayInChatRoomCreate } from "../../app/packets/InChat/PacketPlayInChatRoomCreate";
import { Packet, PacketTypesChat } from "../../app/packets/packetTypes";
import { addRoom, addUser, newMessages } from "../../app/slices/chatSlice";
import store from "../../app/store";
import ChatChannel from "../components/chat/ChatChannel";
import ChatNavigation from "../components/chat/ChatNavigation";
import ChatPrivateMessage from "../components/chat/ChatPrivateMessage";
import ChatCurrentRoom from "../components/chat/ChatRoom";

export const hideDivById = (id: string): void => {
	let tmp = document.getElementById(id);
	if (tmp && tmp.style.display === 'none') {
		tmp.style.display = 'block';
	}
	else if (tmp) {
		tmp.style.display = 'none';
	}
}

export const scrollToBottomById = async (id: string) => {
	let element = document.getElementById(id);
	let height = element?.scrollHeight;
	element?.scrollTo({top: height});
}

export const getCurrentRoom = (): ChatRoom => {
	let room = store.getState().chat.rooms.find(x => x.id === store.getState().chat.current);
	if (room)
		return (room);
	else
		return (store.getState().chat.rooms[0]);
}

export const getRoomById = (id: string): ChatRoom | undefined => {
	return store.getState().chat.rooms.find(x => x.id === id);
}

export const getRoomByName = (name: string): ChatRoom | undefined => {
	return store.getState().chat.rooms.find(x => x.name=== name);
}

export const getTime = (time: number): string => {
	let tmp = new Date(time);
	return (tmp.getHours().toString() + ":" + tmp.getMinutes().toString());
}

export const Chat = () => {
	const socket = useContext(SocketContext);
	const dispatch: Dispatch<AnyAction> = useDispatch();

	useEffect(() => {
		const chatInMessage = (packet: PacketPlayInChatMessage) => {
			if (packet.message.cmd) {
				let cmd: string[] = packet.message.text.split(" ", 1);
				switch (cmd[0]) {
					case "/JOIN": {
						cmd[1] = packet.message.text.substring(cmd[0].length + 1);

						let user: User | undefined = store.getState().users.online.find((x) =>
							x.login === packet.message.from
						);
						if (!user && packet.message.from === store.getState().users.current?.login)
							user = store.getState().users.current;

						if (user) {
							let command: Command = {
								user: user,
								cmd: cmd,
							}
							dispatch(addUser(command));
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
			dispatch(addRoom(packet))
		}

		if (socket) {
			socket.off('chat');
			socket.on('chat', (packet: Packet) => {
				switch (packet.packet_id) {
					case PacketTypesChat.MESSAGE: {
						chatInMessage(packet as PacketPlayInChatMessage);
						break;
					}
					case PacketTypesChat.CREATE: {
						chatInCreate(packet as PacketPlayInChatRoomCreate);
						break;
					}
					default: {
						break;
					}
				}
			});
		}
	}, [socket, dispatch]);

	return (
		<div id="chat">
			<ChatNavigation />
			<ChatChannel />
			<ChatPrivateMessage />
			<ChatCurrentRoom />
		</div>
	);
};
