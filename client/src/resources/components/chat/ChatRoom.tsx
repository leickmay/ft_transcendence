import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/socket";
import { PacketPlayOutChatMessage } from "../../../app/packets/chat/PacketPlayOutChat";
import { RootState } from "../../../app/store";
import {getNameRoom, getTime, scrollToBottomById } from "../../pages/Chat";

const ChatCurrentRoom = () => {
	const socket = useContext(SocketContext);

	const rooms = useSelector((state: RootState) => state.chat.rooms);
	const currentID = useSelector((state: RootState) => state.chat.current);
	const users = useSelector((state: RootState) => state.users);
	const usersBlocked = useSelector((state: RootState) => state.chat.usersBlocked);

	const [current, setCurrent] = useState(rooms?.find(x => x.id === currentID));
	const [newMessage, setNewMessage] = useState('');

	const inputNewMessage = async (element: KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
		if (element.key === 'Enter' && newMessage !== '') {
			if (currentID)
				socket?.emit('chat', new PacketPlayOutChatMessage(currentID, newMessage));
			setNewMessage('');
		}
	}

	useEffect(() => {
		setCurrent(rooms?.find(x => x.id === currentID));
	}, [rooms, currentID]);

	useEffect(() => {
		scrollToBottomById('chatRoomMesssages');
	}, [current?.messages]);

	return (
		<div id="chatRoom" className="chatRight">
			<h2>{getNameRoom(current)}</h2>
			{
				(users.current?.id === current?.operator) &&
				<button>Operator</button>
			}
			<div id="chatRoomMesssages">
			{
					current?.messages?.filter(m => !usersBlocked || !usersBlocked.find(b => b === m.from))
						?.map((value, index) => {
							let from: string = "otherMessage";
							if (value.from === users.current?.login) {
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
					if (event.target.value !== '\n' && event.target.value.length < 256)
						setNewMessage(event.target.value)
					else {
						event.target.value = newMessage;
					}
				}}
				onKeyDown={event => inputNewMessage(event)}
				rows={3}
			/>
		</div>
	);
};

export default ChatCurrentRoom;
