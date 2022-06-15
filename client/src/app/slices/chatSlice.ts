import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatRoom, Command } from "../interfaces/Chat";
import { PacketPlayInChatJoin, PacketPlayInChatMessage, PacketPlayInChatRoomCreate } from "../packets/chat/PacketPlayInChat";

interface State {
	current?: string;
	rooms?: Array<ChatRoom>;
}

const initialState: State = {
	current: "ChatRoom_1",
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
		addRoom: (state: State, action: PayloadAction<PacketPlayInChatRoomCreate>): void => {
			if (state.rooms?.find(x => x.id === action.payload.id))
				return;
			if (state.rooms?.find(x => x.name === action.payload.name))
				return;
			let room: ChatRoom = {
				id: action.payload.id,
				type: action.payload.type,
				name: action.payload.name,
				messages: [],
				visible: action.payload.visible,
				operator: action.payload.operator,
				users: action.payload.users,
			}
			state.rooms?.push(room);
		},
		delRoom: (state: State, action: PayloadAction<ChatRoom>): void => {
			if (action.payload.name === "World Random")
			 	return;
			if (action.payload.id === state.current)
				state.current = "ChatRoom_1";
			state.rooms = state.rooms?.filter(x => x.name !== action.payload.name);
		},
		addUserToRoom: (state: State, action: PayloadAction<PacketPlayInChatJoin>): void => {
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
					operator: roomTmp.operator,
					messages: [],
				}
				state.rooms?.push(room);
			}
		},
		addUser: (state: State, action: PayloadAction<Command>): void => {
			if (action.payload.cmd.length >= 2)
				state.rooms
					?.find(x => x.name === action.payload.cmd[1])
					?.users.push(action.payload.user.id);
		},
		leaveRoom: (state: State, action: PayloadAction<Command>): void => {
			let room = state.rooms?.find(x => x.id === action.payload.room);
			if (room)
				room.users = room?.users.filter(x => x !== action.payload.user.id);
			state.current = "ChatRoom_1";
		},
		newMessages: (state: State, action: PayloadAction<PacketPlayInChatMessage>): void => {
			state.rooms
				?.find(x => x.id === action.payload.room)
				?.messages.push(action.payload.message);
		},
	},
});

export const {setCurrentRooms, setChatRooms, addRoom, addUserToRoom, delRoom, newMessages, addUser, leaveRoom} = slice.actions;
export default slice.reducer;
