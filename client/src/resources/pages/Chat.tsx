import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { ChatRoom, ChatTypes } from "../../app/interfaces/Chat";
import { User } from "../../app/interfaces/User";
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

export const getCurrentRoom = (): ChatRoom | undefined => {
	return store.getState().chat.rooms?.find(x => x.id === store.getState().chat.current);
}

export const getRoomById = (id: string): ChatRoom | undefined => {
	return store.getState().chat.rooms?.find(x => x.id === id);
}

export const getRoomByName = (name: string): ChatRoom | undefined => {
	return store.getState().chat.rooms?.find(x => x.name=== name);
}

export const getTime = (time: number): string => {
	let tmp = new Date(time);
	return (tmp.getHours().toString() + ":" + tmp.getMinutes().toString());
}

export const getNameRoom = (room: ChatRoom | undefined): string | undefined => {
	if (!room)
		return (undefined);
	if (room.type === ChatTypes.CHANNEL) {
		return (room.name);
	}
	if (room.type === ChatTypes.PRIVATE_MESSAGE) {
		let users: number[] = room.users.filter(x => x !== store.getState().users.current?.id);
		if (users.length != 1)
			return (undefined);
		let name: string | undefined = store.getState().users.friends.find(x => x.id === users[0])?.login;
		if (name)
			return (name);
	}
	return (undefined);
}

export const Chat = () => {
	const socket = useContext(SocketContext);
	const dispatch: Dispatch<AnyAction> = useDispatch();

	useEffect(() => {
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
