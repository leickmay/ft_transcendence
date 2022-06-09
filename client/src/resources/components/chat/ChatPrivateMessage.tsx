import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/socket";
import { ChatRoom, ChatTypes } from "../../../app/interfaces/Chat";
import { PacketPlayOutChatCreate } from "../../../app/packets/chat/PacketPlayOutChat";
import store from "../../../app/store";
import { hideDivById } from "../../pages/Chat";

export const switchConfigPrivMsg = () => {
	hideDivById("chatNavigation");
	hideDivById("chatPrivateMessage");
}

const ChatPrivateMessage = () => {

	const socket = useContext(SocketContext);

	const [friends, setFriends] = useState(store.getState().users.friends);
	const alertUsersOnline = useSelector(() => store.getState().users.friends);
	useEffect(() => {
		setFriends(store.getState().users.friends);
	}, [alertUsersOnline]);

	const [rooms, setRooms] = useState(store.getState().chat.rooms);
	const alertRooms = useSelector(() => store.getState().chat.rooms);
	useEffect(() => {
		setRooms(store.getState().chat.rooms);
	}, [alertRooms]);

	const hasAlreadyPrivMsg = (userId: number): boolean => {
		let room: ChatRoom | undefined;
		room = rooms?.find(r => r.type === ChatTypes.PRIVATE_MESSAGE && r.users.find(u => u === userId));
		if (room)
			return (false);
		return (true);
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
			<h2>Players Online</h2>
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
			} */}
		</div>
	);
};
