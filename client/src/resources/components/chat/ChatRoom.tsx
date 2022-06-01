import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/socket";
import { PacketPlayOutChatMessage } from "../../../app/packets/PacketPlayOutChatMessage";
import store from "../../../app/store";
import { getCurrentRoom, getTime, scrollToBottomById } from "../../pages/Chat";

const ChatRoom = () => {
	const socket = useContext(SocketContext);
	//const dispatch: Dispatch<AnyAction> = useDispatch();

	const alertCurrent = useSelector(() => store.getState().chat.current);
	const alertRooms = useSelector(() => store.getState().chat.rooms);

	const [name, setName] = useState(getCurrentRoom().name);
	const [messages, setMessages] = useState(getCurrentRoom().messages);
	const [newMessage, setNewMessage] = useState('');

	const inputNewMessage = async (element: KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
		if (element.key === 'Enter' && newMessage !== '') {
			socket?.emit('chat', new PacketPlayOutChatMessage(store.getState().chat.current, newMessage));
			setNewMessage('');
		}
	}

	useEffect(() => {
		setMessages(getCurrentRoom().messages);
		setName(getCurrentRoom().name);
	}, [alertCurrent, alertRooms]);

	useEffect(() => {
		scrollToBottomById('chatRoomMesssages');
	}, [messages]);

	return (
		<div id="chatRoom" className="chatRight">
			<h2>{name}</h2>
			<div id="chatRoomMesssages">
			{
					messages
						.map((value, index) => {
							let from: string = "otherMessage";
							if (value.from === store.getState().users.current?.name) {
								from = "myMessage";
							}
							return (
								<div className={from} key={index}>
									<div>
										{value.from} - {getTime(value.date)}
									</div>
									<div>
										{value.text}
									</div>
								</div>
							);
					})
				}
			</div>
			<textarea
				id="sendMessage"
				value={newMessage}
				placeholder='Type your message...'
				onChange={event => {
					if (event.target.value !== '\n')
						setNewMessage(event.target.value)
				}}
				onKeyDown={event => inputNewMessage(event)}
				rows={3}
			/>
		</div>
	);
};

export default ChatRoom;
