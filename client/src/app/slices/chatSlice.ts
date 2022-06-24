import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatRoom, Command } from "../interfaces/Chat";
import { PacketPlayInChatAdmin, PacketPlayInChatJoin, PacketPlayInChatMessage, PacketPlayInChatOwner } from "../packets/chat/PacketPlayInChat";

interface State {
	current?: string;
	rooms?: Array<ChatRoom>;
	usersBlocked: Array<string>;
}

const initialState: State = {
	current: "ChatRoom_1",
	usersBlocked: [],
};

const slice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setCurrentRooms: (state: State, action: PayloadAction<string>): void => {
			let room = state.rooms?.find(x => x.id === action.payload);
			if (room)
				state.current = room.id;
		},
		setChatRooms: (state: State, action: PayloadAction<Array<ChatRoom>>): void => {
			state.rooms = action.payload;
		},
		delRoom: (state: State, action: PayloadAction<ChatRoom>): void => {
			if (action.payload.name === "World Random")
			 	return;
			if (action.payload.id === state.current)
				state.current = "ChatRoom_1";
			state.rooms = state.rooms?.filter(x => x.name !== action.payload.name);
		},
		joinRoom: (state: State, action: PayloadAction<PacketPlayInChatJoin>): void => {
			let roomTmp = action.payload.room;
			let room: ChatRoom | undefined = state.rooms?.find(x => x.id === roomTmp.id);
			if (room) {
				room.users = roomTmp.users;
			}
			else {
				room = {
					id: roomTmp.id,
					type: roomTmp.type,
					name: roomTmp.name,
					visible: roomTmp.visible,
					users: roomTmp.users,
					owner: roomTmp.owner,
					admins: roomTmp.admins,
					messages: [],
				}
				state.rooms?.push(room);
			}
		},
		leaveRoom: (state: State, action: PayloadAction<Command>): void => {
			let room = state.rooms?.find(x => x.id === action.payload.room);
			if (room)
				room.users = room?.users.filter(x => x.id !== action.payload.user.id);
			state.current = "ChatRoom_1";
		},
		setOwner: (state: State, action: PayloadAction<PacketPlayInChatOwner>): void => {
			let room = state.rooms?.find(x => x.id === action.payload.room.id);
			if (room)
				room.owner = action.payload.room.owner;
		},
		newMessages: (state: State, action: PayloadAction<PacketPlayInChatMessage>): void => {
			state.rooms
				?.find(x => x.id === action.payload.room)
				?.messages.push(action.payload.message);
		},
		upUsersBlocked: (state: State, action: PayloadAction<Array<string>>): void => {
			state.usersBlocked = action.payload;
		},
		setAdmins: (state: State, action: PayloadAction<PacketPlayInChatAdmin>): void => {
			let room = state.rooms?.find(x => x.id === action.payload.room.id);
			if (room)
				room.admins = action.payload.room.admins;
		},
	},
});

export const {setCurrentRooms, setChatRooms, joinRoom, delRoom, setOwner, newMessages, leaveRoom, upUsersBlocked, setAdmins} = slice.actions;
export default slice.reducer;
