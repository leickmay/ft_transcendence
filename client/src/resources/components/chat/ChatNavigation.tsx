import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChatTypes } from "../../../app/interfaces/Chat";
import { setCurrentRooms } from "../../../app/slices/chatSlice";
import store, { RootState } from "../../../app/store";
import { getNameRoom } from "../../pages/Chat";
import { switchConfigChannel } from "./ChatChannel";
import { switchConfigPrivMsg } from "./ChatPrivateMessage";

export const ChatNavigation = () => {
	const roomsAlert = useSelector((state: RootState) => state.chat.rooms);
	const user = useSelector((state: RootState) => state.users.current);
	const friends = useSelector((state: RootState) => state.users.friends);

	const [rooms, setRooms] = useState(store.getState().chat.rooms);
	useEffect(() => {
		setRooms(store.getState().chat.rooms);
	}, [roomsAlert, friends])

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
						.filter((x) => x.name === "World Random" || x.users.find(u => u === user?.id))
						.map((value, index) => {
							return (
								<div onClick={() => {store.dispatch(setCurrentRooms(value.id))}} key={index}>
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
								<div onClick={() => {store.dispatch(setCurrentRooms(value.id))}} key={index}>
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
