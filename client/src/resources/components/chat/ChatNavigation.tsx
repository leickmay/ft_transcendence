import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChatTypes, ChatRoom } from "../../../app/interfaces/Chat";
import { setCurrentRooms } from "../../../app/slices/chatSlice";
import store from "../../../app/store";
import { getRoomByName, hideDivById } from "../../pages/Chat";

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
					hideDivById("chatNavigation");
					hideDivById("chatChannel");
				}}
			>Channels</button>
			<div className="chatRoomList">
				{
					rooms
						.filter((x) => x.type === ChatTypes.CHANNEL)
						.map((value, index) => {
							return (
								<div onClick={() => {changeRoom(value.name)}} key={index}>
									{value.name.split('channel_', 42)}
								</div>
							);
					})
				}
			</div>
			<button
				onClick={() => {
					hideDivById("chatNavigation");
					hideDivById("chatPrivateMessage");
				}}
			>Privates Messages</button>
			<div className="chatRoomList">
				{
					rooms
						.filter((x) => x.type === ChatTypes.PRIVATE_MESSAGE)
						.map((value, index) => {
							return (
								<div onClick={() => {changeRoom(value.name)}} key={index}>
									{value.name.split('channel_', 42)}
								</div>
							);
					})
				}
			</div>
		</div>
	);
};
