import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/socket";
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
	const friends = useSelector((state: RootState) => state.users.friends);
	const rooms = useSelector((state: RootState) => state.chat.rooms);

	const hasAlreadyPrivMsg = (userId: number): boolean => {
		return !rooms?.find(r => r.type === ChatTypes.PRIVATE_MESSAGE && r.users.find(u => u === userId));
	}

	const createPrivateMessage = (id: number) => {
		let roomPacket : PacketPlayOutChatCreate;
		roomPacket = new PacketPlayOutChatCreate(ChatTypes.PRIVATE_MESSAGE).toPrivateMessage([id]);
		socket?.emit('chat', roomPacket);
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
			<h2>Friends</h2>
			{
				friends
					.filter(u => hasAlreadyPrivMsg(u.id))
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
