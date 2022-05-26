import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { PacketPlayInChatMessage } from "../../app/packets/PacketPlayInChatMessage";
import { PacketPlayOutChatRoomCreate } from "../../app/packets/PacketPlayOutChatRoomCreate";
import { newMessages } from "../../app/slices/chatSlice";
import ChatChannel from "../components/chat/ChatChannel";
import ChatNavigation from "../components/chat/ChatNavigation";
import ChatPrivateMessage from "../components/chat/ChatPrivateMessage";
import ChatRoom from "../components/chat/ChatRoom";

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

export const Chat = () => {
	const socket = useContext(SocketContext);
	const dispatch: Dispatch<AnyAction> = useDispatch();

	// useEffect(() => {
	// 	if (socket) {
	// 		socket.off('MESSAGE');
	// 		socket.on('MESSAGE', (packet: PacketPlayInChatMessage) => {
	// 			console.log("HEY");
	// 			if (!packet.msg)
	// 				return;
	// 			dispatch(newMessages(packet.msg));
	// 		});
	// 	}
	// }, [socket, dispatch]);

	return (
		<div id="chat">
			<ChatNavigation />
			<ChatChannel />
			<ChatPrivateMessage />
			<ChatRoom />
		</div>
	);
};
