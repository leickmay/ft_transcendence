import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/SocketContext";
import { ChatTypes } from "../../../app/interfaces/Chat";
import { PacketPlayOutChatCreate } from "../../../app/packets/chat/PacketPlayOutChat";
import { setTabBigScreen } from "../../../app/slices/chatSlice";
import { RootState } from "../../../app/store";

const ChatPrivateMessage = () => {
	const socket = useContext(SocketContext);
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

	const onlineUsers = useSelector((state: RootState) => state.users.online);
	const rooms = useSelector((state: RootState) => state.chat.rooms);
	const usersBlocked = useSelector((state: RootState) => state.chat.usersBlocked);
	const bigTab = useSelector((state: RootState) => state.chat.tabBigScreen);
	const smallTab = useSelector((state: RootState) => state.chat.tabSmallScreen);

	const hasAlreadyPrivMsg = (userId: number): boolean => {
		return !rooms?.find(r => r.type === ChatTypes.PRIVATE_MESSAGE && r.users.find(u => u.id === userId));
	}

	const createPrivateMessage = (id: number) => {
		let roomPacket : PacketPlayOutChatCreate;
		roomPacket = new PacketPlayOutChatCreate(ChatTypes.PRIVATE_MESSAGE).toPrivateMessage([id]);
		socket?.emit('chat', roomPacket);
		dispatch(setTabBigScreen(0));
	}

	const isBlocked = (login: string): boolean => {
		if (!usersBlocked)
			return false;
		if (usersBlocked && usersBlocked.find(x => x === login))
			return true;
		return false;
	}

	const setClassName = (tab: number) => {
		let className: string = "chatLeft";
		if (bigTab === tab)
			className = className + " tabChat-active";
		else
			className = className + " tabChat-inactive";
		if (smallTab === 1)
			className = className + " room-active";
		else
			className = className + " room-inactive";
		return className;
	}

	return (
		<div
			id="chatPrivateMessage"
			className={setClassName(2)}
		>
			<div
				className="goBack"
				onClick={() => {dispatch(setTabBigScreen(0))}}
			>
				❎
			</div>
			<div className="goBack">Online Players</div>
			{
				onlineUsers
					.filter(u => hasAlreadyPrivMsg(u.id))
					.filter(u => !isBlocked(u.login))
					.map((value, index) => {
					return (
						<div
							className="onlineList"
							key={index} 
							onClick={() => {
								createPrivateMessage(value.id);
							}}
						>
							💬 {value.login}
						</div>
					)
				})
			}
		</div>
	);
};

export default ChatPrivateMessage;
