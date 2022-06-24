import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/SocketContext";
import { ChatTypes } from "../../../app/interfaces/Chat";
import { PacketPlayOutChatCreate } from "../../../app/packets/chat/PacketPlayOutChat";
import { setTab } from "../../../app/slices/chatSlice";
import { RootState } from "../../../app/store";

const ChatPrivateMessage = () => {
	const socket = useContext(SocketContext);
	const dispatch: Dispatch<AnyAction> = useDispatch();

	const onlineUsers = useSelector((state: RootState) => state.users.online);
	const rooms = useSelector((state: RootState) => state.chat.rooms);
	const usersBlocked = useSelector((state: RootState) => state.chat.usersBlocked);
	const tab = useSelector((state: RootState) => state.chat.tab);

	const hasAlreadyPrivMsg = (userId: number): boolean => {
		return !rooms?.find(r => r.type === ChatTypes.PRIVATE_MESSAGE && r.users.find(u => u.id === userId));
	}

	const createPrivateMessage = (id: number) => {
		let roomPacket : PacketPlayOutChatCreate;
		roomPacket = new PacketPlayOutChatCreate(ChatTypes.PRIVATE_MESSAGE).toPrivateMessage([id]);
		socket?.emit('chat', roomPacket);
		dispatch(setTab(0));
	}

	const isBlocked = (login: string): boolean => {
		if (!usersBlocked)
			return false;
		if (usersBlocked && usersBlocked.find(x => x === login))
			return true;
		return false;
	}

	return (
		<div
			id="chatPrivateMessage"
			className={tab === 2 ? "chatLeft  tabChat-active" : "chatLeft tabChat-inactive"}
		>
			<button
				onClick={() => {
					dispatch(setTab(0));
				}}
			>..</button>
			<h2>Online Players</h2>
			{
				onlineUsers
					.filter(u => hasAlreadyPrivMsg(u.id))
					.filter(u => !isBlocked(u.login))
					.map((value, index) => {
					return (
						<div
							key={index} 
							onClick={() => {
								createPrivateMessage(value.id);
							}}
						>
							+ {value.login}
						</div>
					)
				})
			}
		</div>
	);
};

export default ChatPrivateMessage;
