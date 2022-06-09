import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/socket";
import { ChatTypes } from "../../../app/interfaces/Chat";
import { PacketPlayOutChatCreate, PacketPlayOutChatJoin } from "../../../app/packets/chat/PacketPlayOutChat";
import { setCurrentRooms } from "../../../app/slices/chatSlice";
import store from "../../../app/store";
import { hideDivById } from "../../pages/Chat";

export const switchConfigChannel = () => {
	hideDivById("chatNavigation");
	hideDivById("chatChannel");
}

const ChatChannel = () => {
	const socket = useContext(SocketContext);
	//const dispatch: Dispatch<AnyAction> = useDispatch();

	const [name, setName] = useState('');
	const [isPrivate, setIsPrivate] = useState(false);
	const [hasPassword, setHasPassword] = useState(false);
	const [password, setPassword] = useState('');

	const [rooms, setRooms] = useState(
		store.getState().chat.rooms?.filter(
			x => x.users.find(u => u !== store.getState().users.current?.id)
		)
	);

	const alertRooms = useSelector(() => store.getState().chat.rooms);

	useEffect(() => {
		setRooms(
			store.getState().chat.rooms?.filter(
				x => x.users.find(u => u === store.getState().users.current?.id) === undefined
			)
		);
	}, [alertRooms]);


	const createChannel = (): void => {
		let roomPacket : PacketPlayOutChatCreate;
		
		roomPacket = new PacketPlayOutChatCreate(ChatTypes.CHANNEL).toChannel(name, !isPrivate);

		if (hasPassword && password !== "")
			roomPacket.withPassword(password);

		socket?.emit('chat', roomPacket);

		store.dispatch(setCurrentRooms(name));
		
		setName('');
		setIsPrivate(false);
		setHasPassword(false);
		setPassword('');
		hideDivById('input_password');
	}

	const joinChannel = (): void => {
		let roomPacket : PacketPlayOutChatJoin;
		
		roomPacket = new PacketPlayOutChatJoin(name);
		if (hasPassword && password !== "")
			roomPacket.withPassword(password);

		socket?.emit('chat', roomPacket);
		
		setName('');
		setIsPrivate(false);
		setHasPassword(false);
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
			<label>
				Name
				<input
					list="channel-visible"
					name="names"
					type="text"
					placeholder="Name"
					value={name}
					onChange={event => setName(event.target.value)}
				/>
				<datalist id="channel-visible">
					{
						rooms?.map((x, index) => {
							return (
								<option key={index}>{x.name}</option>
							);
						})
					}
				</datalist>
			</label>
			<label>
				Private
				<input
					type="checkbox"
					checked={isPrivate}
					onChange={() => {setIsPrivate(!isPrivate)}}
				/>
			</label>
			<label>
				Password 
				<input
					type="checkbox"
					checked={hasPassword}
					onChange={() => {
						hideDivById('input_password');
						setHasPassword(!hasPassword)}
					}
				/>
			</label>
			<input
					id="input_password"
					type="password"
					placeholder="Password"
					value={password}
					onChange={event => setPassword(event.target.value)}
					style={{display: "none"}}
			/>
			<button
				onClick={() => {
					createChannel();
					switchConfigChannel();
				}}
			>Create</button>
			<button
				onClick={() => {
					joinChannel();
					switchConfigChannel();
				}}
			>Join</button>
		</div>
	);
};

export default ChatChannel;
