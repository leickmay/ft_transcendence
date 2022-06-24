import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/SocketContext";
import { ChatTypes } from "../../../app/interfaces/Chat";
import { PacketPlayOutChatCreate } from "../../../app/packets/chat/PacketPlayOutChat";
import { setCurrentRooms } from "../../../app/slices/chatSlice";
import { RootState } from "../../../app/store";
import { hideDivById } from "../../pages/Chat";

export const switchConfigChannel = () => {
	hideDivById("chatNavigation");
	hideDivById("chatChannel");
}

const ChatChannel = () => {
	const socket = useContext(SocketContext);
	const dispatch: Dispatch<AnyAction> = useDispatch();

	const [name, setName] = useState('');
	const [isPrivate, setIsPrivate] = useState(false);
	const [password, setPassword] = useState('');
	
	const user = useSelector((state: RootState) => state.users.current);
	const rooms = useSelector((state: RootState) => state.chat.rooms);
	
	const [roomsOffline, setRoomsOffline] = useState(rooms?.filter(
		x => x.users.find(u => u.id === user?.id) === undefined
	));

	useEffect(() => {
		setRoomsOffline(rooms?.filter(
			x => x.users.find(u => u.id === user?.id) === undefined)
		);
	}, [rooms, user])


	const createChannel = (): void => {
		if (name === '')
			return;

		let roomPacket = new PacketPlayOutChatCreate(ChatTypes.CHANNEL).toChannel(name, !isPrivate);
		if (password !== "")
			roomPacket.withPassword(password);

		socket?.emit('chat', roomPacket);
		dispatch(setCurrentRooms(name));
		
		setName('');
		setIsPrivate(false);
		setPassword('');
		hideDivById('input_password');
	}

	return (
		<div
			id="chatChannel"
			className="chatLeft"
			style={{display: "none"}}
		>
			<button
				onClick={() => {switchConfigChannel()}}
			>..</button>
			<div>
				<input
					id="channelName"
					list="channel-visible"
					name="names"
					type="text"
					placeholder="Name"
					value={name}
					onChange={event => 
					{
						if (event.target.value !== '\n' && event.target.value.length < 32)
							setName(event.target.value)
						else
							event.target.value = name;
					}}
				/>
				<datalist id="channel-visible">
					{
						roomsOffline?.map((x, index) => {
							return (
								<option key={index}>{x.name}</option>
							);
						})
					}
				</datalist>
			</div>
			<input
					id="input_password"
					type="password"
					placeholder="Password"
					value={password}
					onChange={event => {
						if (event.target.value !== '\n' && event.target.value.length < 256)
							setPassword(event.target.value)
						else
							event.target.value = name;
					}}
			/>
			<div>
				<label htmlFor="channelPrivate">
					Private
				</label>
				<input
					id="channelPrivate"
					type="checkbox"
					checked={isPrivate}
					onChange={() => {setIsPrivate(!isPrivate)}}
				/>
			</div>
			<button
				onClick={() => {
					createChannel();
					switchConfigChannel();
				}}
			>Submit</button>
		</div>
	);
};

export default ChatChannel;
