import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { ChatRoom } from "../../app/interfaces/Chat";
import { PacketPlayInChatMessage } from "../../app/packets/InChat/PacketPlayInChatMessage";
import { PacketPlayInChatRoomCreate } from "../../app/packets/InChat/PacketPlayInChatRoomCreate";
import { Packet, PacketTypesChat } from "../../app/packets/packetTypes";
import { addRoom, newMessages } from "../../app/slices/chatSlice";
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
		if (socket) {
			socket.off('chat');
			socket.on('chat', (packet: Packet) => {
				switch (packet.packet_id) {
					case PacketTypesChat.MESSAGE: {
						dispatch(newMessages(packet as PacketPlayInChatMessage));
						break;
					}
					case PacketTypesChat.CREATE: {
						dispatch(addRoom(packet as PacketPlayInChatRoomCreate))
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
