import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatTypes } from "../../../app/interfaces/Chat";
import { setCurrentRooms, setTab } from "../../../app/slices/chatSlice";
import store, { RootState } from "../../../app/store";
import { getNameRoom } from "../../pages/Chat";

export const ChatNavigation = () => {
	const dispatch: Dispatch<AnyAction> = useDispatch();

	const roomsAlert = useSelector((state: RootState) => state.chat.rooms);
	const user = useSelector((state: RootState) => state.users.current);
	const friends = useSelector((state: RootState) => state.users.friends);
	const tab = useSelector((state: RootState) => state.chat.tab);

	const [rooms, setRooms] = useState(store.getState().chat.rooms);
	useEffect(() => {
		setRooms(store.getState().chat.rooms);
	}, [roomsAlert, friends])

	return (
		<div
			id="chatNavigation"
			className={tab === 0 ? "chatLeft  tabChat-active" : "chatLeft tabChat-inactive"}
		>
			<button
				onClick={() => {
					dispatch(setTab(1));
				}}
			>Channels</button>
			<div className="chatRoomList">
				{
					rooms
						?.filter((x) => x.type === ChatTypes.CHANNEL)
						.filter((x) => x.name === "World Random" || x.users.find(u => u.id === user?.id))
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
					dispatch(setTab(2));
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
