import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChatTypes, ChatRoom } from "../../../app/interfaces/Chat";
import { setCurrentRooms } from "../../../app/slices/chatSlice";
import store from "../../../app/store";
import { getNameRoom, getRoomByName } from "../../pages/Chat";
import { switchConfigChannel } from "./ChatChannel";
import { switchConfigPrivMsg } from "./ChatPrivateMessage";

export const ChatNavigation = () => {

	const [rooms, setRooms] = useState(store.getState().chat.rooms);

	const alertRooms = useSelector(() => store.getState().chat.rooms);

	useEffect(() => {
		setRooms(store.getState().chat.rooms);
	}, [alertRooms]);

	const changeRoom = (name: string): void => {
		let room: ChatRoom | undefined = getRoomByName(name);
		if (room)
			store.dispatch(setCurrentRooms(room.id));
	}

	return (
		<div
			id="chatNavigation"
			className="chatLeft"
		>
			<button
				onClick={() => {
					switchConfigChannel();
				}}
			>Channels</button>
			<div className="chatRoomList">
				{
					rooms
						?.filter((x) => x.type === ChatTypes.CHANNEL)
						.filter((x) => x.name === "World Random" || x.users.find(u => u === store.getState().users.current?.id))
						.map((value, index) => {
							return (
								<div onClick={() => {changeRoom(value.name)}} key={index}>
									{value.name}
								</div>
							);
					})
				}
			</div>
			<button
				onClick={() => {
					switchConfigPrivMsg();
				}}
			>Privates Messages</button>
			<div className="chatRoomList">
				{
					rooms
						?.filter((x) => x.type === ChatTypes.PRIVATE_MESSAGE)
						.map((value, index) => {
							return (
								<div onClick={() => {changeRoom(value.name)}} key={index}>
									{getNameRoom(value)}
								</div>
							);
					})
				}
			</div>
		</div>
	);
};

export default ChatNavigation;
