import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/SocketContext";
import { ChatTypes } from "../../../app/interfaces/Chat";
import { PacketPlayOutChatCreate } from "../../../app/packets/chat/PacketPlayOutChat";
import { setCurrentRooms, setTabBigScreen } from "../../../app/slices/chatSlice";
import { RootState } from "../../../app/store";

const ChatChannel = () => {
	const socket = useContext(SocketContext);
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

	const [name, setName] = useState('');
	const [isPrivate, setIsPrivate] = useState(false);
	const [password, setPassword] = useState('');
	
	const user = useSelector((state: RootState) => state.users.current);
	const rooms = useSelector((state: RootState) => state.chat.rooms);
	const bigTab = useSelector((state: RootState) => state.chat.tabBigScreen);
	const smallTab = useSelector((state: RootState) => state.chat.tabSmallScreen);
	
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
		dispatch(setTabBigScreen(0));
	}

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
			id="chatChannel"
			className={setClassName(1)}
		>
			<div
				className="goBack"
				onClick={() => {dispatch(setTabBigScreen(0))}}
			>
				❌
			</div>
			<div className="inputChannel">
				<label htmlFor="channelName">
					Name :
				</label>
				<input
					id="channelName"
					list="channel-visible"
					name="names"
					type="text"
					placeholder="Name"
					value={name}
					maxLength={16}
					onChange={event => {
						if (event.target.value !== '\n')
							setName(event.target.value)
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
			<div className="inputChannel">
				<label htmlFor="input_password">
					Password :
				</label>
				<input
						id="input_password"
						type="password"
						placeholder="Password"
						value={password}
						maxLength={32}
						onChange={event => {
							if (event.target.value !== '\n')
								setPassword(event.target.value)
						}}
				/>
			</div>
			<div className="inputChannel checkBox">
				<label htmlFor="channelPrivate">
					Private {isPrivate ? '✅' : '❌'}
				</label>
				<input
					id="channelPrivate"
					type="checkbox"
					style={{ display: 'none' }}
					checked={isPrivate}
					onChange={() => {setIsPrivate(!isPrivate)}}
				/>
			</div>
			<button
				onClick={() => {
					createChannel();
				}}
			>Create or Join</button>
		</div>
	);
};

export default ChatChannel;
