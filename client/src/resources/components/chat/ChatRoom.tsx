import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch, KeyboardEvent, useContext } from "react";
import { useDispatch } from "react-redux";
import { SocketContext } from "../../../app/context/socket";

export const ChatRoom = () => {
	const socket = useContext(SocketContext);
	const dispatch: Dispatch<AnyAction> = useDispatch();

	// const alertCurrentRoom = useSelector(() => store.getState().chat.currentRooms);

	// const [name, setName] = useState('Unknown');
	// const [messages, setMessages] = useState(store.getState().chat.currentRooms.messages);
	// const [newMessage, setNewMessage] = useState('');

	const inputNewMessage = async (element: KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
		// if (element.key === 'Enter' && newMessage !== '') {
		// 	let user: User | undefined = store.getState().users.current;
		// 	if (!user)
		// 		return;
		// 	let date: Date = new Date();
		// 	let msg: Message = {
		// 		from: user.login,
		// 		to: store.getState().chat.currentRooms.name,
		// 		date: date.getHours().toString() + ":" + date.getMinutes().toString(),
		// 		message: newMessage,
		// 	};
		// 	let packet: PacketPlayOutChatMessage = new PacketPlayOutChatMessage(
		// 		PacketTypesChat.MESSAGE,
		// 		msg,
		// 	);
		// 	dispatch(newMessages(msg));
		// 	if (socket)
		// 		socket.emit('chat', packet);
		// 	setNewMessage('');
		// }
	}

	// useEffect(() => {
	// 	setMessages(store.getState().chat.currentRooms.messages);
	// 	setName(store.getState().chat.currentRooms.name.substring(8, 42));
	// }, [alertCurrentRoom]);

	// useEffect(() => {
	// 	scrollToBottomById('chatRoomMesssages');
	// }, [messages]);

	return (
		<div id="chatRoom" className="chatRight">
			{/* <h2>{name}</h2> */}
			<div id="chatRoomMesssages">
				{/* {
					messages
						.map((value, index) => {
							let from: string = "otherMessage";
							if (value.from === store.getState().users.current?.login) {
								from = "myMessage";
							}
							return (
								<div className={from} key={index}>
									<div>
										{value.from} - {value.date}
									</div>
									<div>
										{value.message}
									</div>
								</div>
							);
					})
				} */}
			</div>
			{/* <textarea
				id="sendMessage"
				value={newMessage}
				placeholder='Type your message...'
				onChange={event => {
					if (event.target.value !== '\n')
						setNewMessage(event.target.value)
				}}
				onKeyDown={event => inputNewMessage(event)}
				rows={3}
			/> */}
		</div>
	);
};
