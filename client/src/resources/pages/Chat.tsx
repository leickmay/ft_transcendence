import { ChatRoom, ChatTypes } from "../../app/interfaces/Chat";
import { UserPreview, User } from "../../app/interfaces/User";
import store from "../../app/store";
import ChatChannel from "../components/chat/ChatChannel";
import { ChatNavigation } from "../components/chat/ChatNavigation";
import ChatPrivateMessage from "../components/chat/ChatPrivateMessage";
import ChatCurrentRoom from "../components/chat/ChatRoom";

/*
**	Utils
*/

export const scrollToBottomById = async (id: string) => {
	let element = document.getElementById(id);
	let height = element?.scrollHeight;
	element?.scrollTo({ top: height });
}

/*
**	Users
*/

export const getUserByLogin = (login: string): User | undefined => {
	let user: User | undefined;
	user = store.getState().users.friends.find((x) => x.login === login);
	if (!user)
		user = store.getState().users.current;
	if (user?.login === login)
		return (user);
	return (undefined);
}

/*
**	Rooms
*/

export const getNameRoom = (room: ChatRoom | undefined): string | undefined => {
	if (!room)
		return (undefined);
	if (room.type === ChatTypes.CHANNEL) {
		return (room.name);
	}
	if (room.type === ChatTypes.PRIVATE_MESSAGE) {
		let users: Array<UserPreview> = room.users.filter(x => x.id !== store.getState().users.current?.id);
		if (users.length === 1)
			return(users[0].login)
	}
	return (undefined);
}

/*
**	Time
*/

export const getTime = (time: number): string => {
	let tmp = new Date(time);
	return (tmp.getHours().toString() + ":" + tmp.getMinutes().toString());
}

export const Chat = () => {
	return (
		<div id="chat" className="container">
			<ChatNavigation />
			<ChatChannel />
			<ChatPrivateMessage />
			<ChatCurrentRoom />
		</div>
	);
};
