import { useContext, useState } from "react";
import { SocketContext } from "../../../app/context/socket";
import { PacketPlayOutChatChannelCreate } from "../../../app/packets/OutChat/PacketPlayOutChatChannelCreate";
import { PacketPlayOutChatChannelJoin } from "../../../app/packets/OutChat/PacketPlayOutChatChannelJoin";
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

	const createChannel = (): void => {
		let roomPacket : PacketPlayOutChatChannelCreate;
		
		roomPacket = new PacketPlayOutChatChannelCreate(name, !isPrivate);
		if (hasPassword && password !== "")
			roomPacket.withPassword(password);

		socket?.emit('chat', roomPacket);
		
		setName('');
		setIsPrivate(false);
		setHasPassword(false);
		setPassword('');
		hideDivById('input_password');

		store.dispatch(setCurrentRooms(roomPacket.name));
	}

	const joinChannel = (): void => {
		let roomPacket : PacketPlayOutChatChannelJoin;
		
		roomPacket = new PacketPlayOutChatChannelJoin(name);
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
					name="names"
					type="text"
					placeholder="Name"
					value={name}
					onChange={event => setName(event.target.value)}
				/>
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
