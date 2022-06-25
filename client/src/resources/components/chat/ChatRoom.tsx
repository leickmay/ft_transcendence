import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/SocketContext";
import { PacketPlayOutChatMessage } from "../../../app/packets/chat/PacketPlayOutChat";
import { RootState } from "../../../app/store";
import {getNameRoom, getTime, scrollToBottomById } from "../../pages/Chat";
import { ChatButtonNav } from "./ChatButtonNav";

const ChatCurrentRoom = () => {
	const socket = useContext(SocketContext);

	const rooms = useSelector((state: RootState) => state.chat.rooms);
	const currentID = useSelector((state: RootState) => state.chat.current);
	const users = useSelector((state: RootState) => state.users);
	const usersBlocked = useSelector((state: RootState) => state.chat.usersBlocked);
	//const bigTab = useSelector((state: RootState) => state.chat.tabBigScreen);
	const smallTab = useSelector((state: RootState) => state.chat.tabSmallScreen);


	const [current, setCurrent] = useState(rooms?.find(x => x.id === currentID));
	const [newMessage, setNewMessage] = useState('');

	const inputNewMessage = async (element: KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
		if (element.key === 'Enter' && newMessage !== '') {
			if (currentID) {
				socket?.emit('chat', new PacketPlayOutChatMessage(currentID, newMessage));
			}
			setNewMessage('');
		}
	}

	useEffect(() => {
		setCurrent(rooms?.find(x => x.id === currentID));
	}, [rooms, currentID]);

	useEffect(() => {
		scrollToBottomById('chatRoomMesssages');
	}, [current?.messages]);

	const getGrade = (): string => {
		if (users.current?.id === current?.owner)
			return " (Owner)";
		if (current?.admins?.find(x => x === users.current?.id))
			return " (Admin)";
		return "";
	}

	const setClassName = () => {
		let className: string = "chatRight";
		if (smallTab === 0)
			className = className + " room-active";
		else
			className = className + " room-inactive";
		return className;
	}

	return (
		<div id="chatRoom" className={setClassName()}>
			<ChatButtonNav />
			<h2>{getNameRoom(current)}{getGrade()}</h2>
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
				maxLength={256}
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
