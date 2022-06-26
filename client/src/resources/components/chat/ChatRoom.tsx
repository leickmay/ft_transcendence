import { FormHelperText } from "@mui/material";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../app/context/SocketContext";
import { ChatTypes } from "../../../app/interfaces/Chat";
import { PacketPlayInChatMessage } from "../../../app/packets/chat/PacketPlayInChat";
import { PacketPlayOutChatMessage } from "../../../app/packets/chat/PacketPlayOutChat";
import { PacketPlayOutProfile } from "../../../app/packets/PacketPlayOutProfile";
import { PacketTypesChat } from "../../../app/packets/packetTypes";
import { newMessages, setTabSmallScreen } from "../../../app/slices/chatSlice";
import { RootState } from "../../../app/store";
import {getNameRoom, getTime, scrollToBottomById } from "../../pages/Chat";

const ChatCurrentRoom = () => {
	const socket = useContext(SocketContext);
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

	const rooms = useSelector((state: RootState) => state.chat.rooms);
	const currentID = useSelector((state: RootState) => state.chat.current);
	const users = useSelector((state: RootState) => state.users);
	const usersBlocked = useSelector((state: RootState) => state.chat.usersBlocked);
	const smallTab = useSelector((state: RootState) => state.chat.tabSmallScreen);


	const [current, setCurrent] = useState(rooms?.find(x => x.id === currentID));
	const [newMessage, setNewMessage] = useState('');

	const sendHelp = async (msg: string) => {
		let help: PacketPlayInChatMessage = {
			packet_id: PacketTypesChat.MESSAGE,
			room: currentID || "",
			message: {
				date: Date.now(),
				from: {
					login: "help",
					name: "HELP",
				},
				text: msg,
				cmd: true,
			},
		}
		dispatch(newMessages(help));
	}

	const inputNewMessage = async (element: KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
		if (element.key === 'Enter' && newMessage !== '') {
			if (currentID && newMessage.toUpperCase().startsWith('/HELP')) {
				sendHelp('(Everyone) /EXIT');
				sendHelp('(Everyone) /BLOCK login');
				sendHelp('(Everyone) /UNBLOCK login');
				sendHelp('(Admin) /KICK login');
				sendHelp('(Admin) /BAN login time');
				sendHelp('(Admin) /UNBAN login');
				sendHelp('(Admin) /MUTE login time');
				sendHelp('(Admin) /UNMUTE login');
				sendHelp('(Owner) /PROMOTE login');
				sendHelp('(Owner) /DEMOTE login');
				sendHelp('(Owner) /PASSWORD *****');
			}
			else if (currentID) {
				socket?.emit('chat', new PacketPlayOutChatMessage(currentID, newMessage));
			}
			setNewMessage('');
		}
	}

	useEffect(() => {
		setCurrent(rooms?.find(x => x.id === currentID));
	}, [rooms, currentID]);

	useEffect(() => {
		scrollToBottomById('chatRoomMesssages');
	}, [current?.messages]);

	const getGrade = (): string => {
		if (users.current?.id === current?.owner)
			return " (Owner)";
		if (current?.admins?.find(x => x === users.current?.id))
			return " (Admin)";
		return "";
	}

	const setClassName = () => {
		let className: string = "chatRight";
		if (smallTab === 0)
			className = className + " room-active";
		else
			className = className + " room-inactive";
		return className;
	}

	const getTitleWithButtonOrNot = () => {
		if (current?.type === ChatTypes.PRIVATE_MESSAGE) {
			return (
				<h2>
					<div onClick={() => {
							socket?.emit('stats', new PacketPlayOutProfile(getNameRoom(current) || ""));
						}}
					>
						{getNameRoom(current)}
					</div>
				</h2>
			);
		}
		else {
			return (
				<h2>{getNameRoom(current)}{getGrade()}</h2>
			);
		}
	}

	const getButtonOnLoginToProfile = (login: string, name: string, date: number) => {
		return (
			<div onClick={() => {
			 		socket?.emit('stats', new PacketPlayOutProfile(login));
				}}
			>
				{name} ({login}) - {getTime(date)}
			</div>
		);
	}

	return (
		<div id="chatRoom" className={setClassName()}>
			<button id={"buttonNav"} onClick={() => {
				dispatch(setTabSmallScreen(1));
				}}
			>
				Settings
			</button>
			{getTitleWithButtonOrNot()}
			<div id="chatRoomMesssages">
			{
					current?.messages?.filter(m => !usersBlocked || !usersBlocked.find(b => b === m.from.login))
						?.map((value, index) => {
							let from: string = "otherMessage";
							if (value.from.login === users.current?.login) {
								from = "myMessage";
							}
							if (value.cmd === true) {
								from = "cmd"
							}
							return (
								<div className={from} key={index}>
									{getButtonOnLoginToProfile(value.from.login, value.from.name, value.date)}
									<div>
										{value.text}
									</div>
								</div>
							);
					})
				}
			</div>
			<textarea
				id="sendMessage"
				value={newMessage}
				placeholder='Type your message...'
				maxLength={256}
				onChange={event => {
					if (event.target.value !== '\n')
						setNewMessage(event.target.value)
				}}
				onKeyDown={event => inputNewMessage(event)}
				rows={3}
			/>
		</div>
	);
};

export default ChatCurrentRoom;
