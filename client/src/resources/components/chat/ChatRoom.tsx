import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/socket";
import { ChatTypes } from "../../../app/interfaces/Chat";
import { PacketPlayOutChatMessage } from "../../../app/packets/chat/PacketPlayOutChat";
import store from "../../../app/store";
import { getCurrentRoom, getTime, scrollToBottomById } from "../../pages/Chat";

const ChatCurrentRoom = () => {
	const socket = useContext(SocketContext);
	//const dispatch: Dispatch<AnyAction> = useDispatch();

	const alertCurrent = useSelector(() => store.getState().chat.current);
	const alertRooms = useSelector(() => store.getState().chat.rooms);

	const [name, setName] = useState(getCurrentRoom()?.name);
	const [messages, setMessages] = useState(getCurrentRoom()?.messages);
	const [newMessage, setNewMessage] = useState('');

	const inputNewMessage = async (element: KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
		if (element.key === 'Enter' && newMessage !== '') {
			let current = store.getState().chat.current;
			if (current)
				socket?.emit('chat', new PacketPlayOutChatMessage(current, newMessage));
			setNewMessage('');
		}
	}

	useEffect(() => {
		setMessages(getCurrentRoom()?.messages);
		if (getCurrentRoom()?.type === ChatTypes.CHANNEL)
			setName(getCurrentRoom()?.name);
		else if (getCurrentRoom()?.type === ChatTypes.PRIVATE_MESSAGE) {
			//let id = getCurrentRoom()?.users.filter(x => x !== );
			//if (id) {
			//	setName(store.getState().users.online.find(x => x.id === id)?.login);
		//	}
		}
	}, [alertCurrent, alertRooms]);

	useEffect(() => {
		scrollToBottomById('chatRoomMesssages');
	}, [messages]);

	return (
		<div id="chatRoom" className="chatRight">
			<h2>{name}</h2>
			{
				(store.getState().users.current?.id === getCurrentRoom()?.operator) &&
				<button>Operator</button>
			}
			<div id="chatRoomMesssages">
			{
					messages
						?.map((value, index) => {
							let from: string = "otherMessage";
							if (value.from === store.getState().users.current?.login) {
								from = "myMessage";
							}
							if (value.cmd === true) {
								from = "cmd"
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

export default ChatCurrentRoom;
