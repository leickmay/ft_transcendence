import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/SocketContext";
import { ChatTypes } from "../../../app/interfaces/Chat";
import { PacketPlayOutChatCreate } from "../../../app/packets/chat/PacketPlayOutChat";
import { RootState } from "../../../app/store";
import { hideDivById } from "../../pages/Chat";

export const switchConfigPrivMsg = () => {
	hideDivById("chatNavigation");
	hideDivById("chatPrivateMessage");
}

const ChatPrivateMessage = () => {
	const socket = useContext(SocketContext);
	const onlineUsers = useSelector((state: RootState) => state.users.online);
	const rooms = useSelector((state: RootState) => state.chat.rooms);
	const usersBlocked = useSelector((state: RootState) => state.chat.usersBlocked);

	const hasAlreadyPrivMsg = (userId: number): boolean => {
		return !rooms?.find(r => r.type === ChatTypes.PRIVATE_MESSAGE && r.users.find(u => u.id === userId));
	}

	const createPrivateMessage = (id: number) => {
		let roomPacket : PacketPlayOutChatCreate;
		roomPacket = new PacketPlayOutChatCreate(ChatTypes.PRIVATE_MESSAGE).toPrivateMessage([id]);
		socket?.emit('chat', roomPacket);
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
			className="chatLeft"
			style={{display: "none"}}
		>
			<button
				onClick={() => {
					switchConfigPrivMsg();
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
								switchConfigPrivMsg();
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
