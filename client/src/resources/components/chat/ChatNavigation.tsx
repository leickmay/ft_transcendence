import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatTypes } from "../../../app/interfaces/Chat";
import { setCurrentRooms, setTabBigScreen, setTabSmallScreen } from "../../../app/slices/chatSlice";
import store, { RootState } from "../../../app/store";
import { getNameRoom } from "../../pages/Chat";

export const ChatNavigation = () => {
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

	const roomsAlert = useSelector((state: RootState) => state.chat.rooms);
	const user = useSelector((state: RootState) => state.users.current);
	const friends = useSelector((state: RootState) => state.users.friends);
	const bigTab = useSelector((state: RootState) => state.chat.tabBigScreen);
	const smallTab = useSelector((state: RootState) => state.chat.tabSmallScreen);

	const [rooms, setRooms] = useState(store.getState().chat.rooms);
	useEffect(() => {
		setRooms(store.getState().chat.rooms);
	}, [roomsAlert, friends])


	const setClassName = (tab: number) => {
		let className: string = "chatLeft";
		if (bigTab === tab)
			className = className + " tabChat-active";
		else
			className = className + " tabChat-inactive";
		if (smallTab === 1)
			className = className + " room-active";
		else
			className = className + " room-inactive";
		return className;
	}

	return (
		<div
			id="chatNavigation"
			className={setClassName(0)}
		>
			<button
				onClick={() => {
					dispatch(setTabBigScreen(1));
				}}
			>Channels</button>
			<div className="chatRoomList">
				{
					rooms
						?.filter((x) => x.type === ChatTypes.CHANNEL)
						.filter((x) => x.name === "World Random" || x.users.find(u => u.id === user?.id))
						.map((value, index) => {
							return (
								<div onClick={() => {
											dispatch(setCurrentRooms(value.id))
											dispatch(setTabSmallScreen(0));
										}} key={index}
								>
									{value.name}
								</div>
							);
					})
				}
			</div>
			<button
				onClick={() => {
					dispatch(setTabBigScreen(2));
				}}
			>Privates Messages</button>
			<div className="chatRoomList">
				{
					rooms
						?.filter((x) => x.type === ChatTypes.PRIVATE_MESSAGE)
						.map((value, index) => {
							return (
								<div onClick={() => {
										dispatch(setCurrentRooms(value.id));
										dispatch(setTabSmallScreen(0));
									}} key={index}
								>
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
