import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChatFlags } from "../../../app/interfaces/Chat";
import store from "../../../app/store";
import { hideDivById } from "../../pages/Chat";

const ChatNavigation = () => {

	const [rooms, setRooms] = useState(store.getState().chat.rooms);

	const alertRooms = useSelector(() => store.getState().chat.rooms);

	useEffect(() => {
		setRooms(store.getState().chat.rooms);
	}, [alertRooms]);

	const changeRoom = (name: string): void => {

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
						.filter((x) => x.flags === ChatFlags.CHANNEL)
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
						.filter((x) => x.flags === ChatFlags.PRIVATE_MESSAGE)
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

export default ChatNavigation;
