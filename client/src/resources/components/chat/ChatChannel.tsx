import { useContext, useState } from "react";
import { SocketContext } from "../../../app/context/socket";
import { PacketPlayOutChatChannelCreate } from "../../../app/packets/OutChat/PacketPlayOutChatChannelCreate";
import { hideDivById } from "../../pages/Chat";

const ChatChannel = () => {

	const socket = useContext(SocketContext);

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
	}

	const joinChannel = (): void => {
		
	}

	return (
		<div
			id="chatChannel"
			className="chatLeft"
			style={{display: "none"}}
		>
			<button
				onClick={() => {
					hideDivById("chatNavigation");
					hideDivById("chatChannel");
				}}
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
			<button onClick={createChannel}>Create</button>
			<button onClick={joinChannel}>Join</button>
		</div>
	);
};

export default ChatChannel;
