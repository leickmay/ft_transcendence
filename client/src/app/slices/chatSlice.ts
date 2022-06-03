import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatRoom, Command } from "../interfaces/Chat";
import { PacketPlayInChatMessage, PacketPlayInChatRoomCreate } from "../packets/chat/PacketPlayInChat";

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
		setCurrentRooms: (state: State, action: PayloadAction<string>): State => {
			let room = state.rooms?.find(x => x.id === action.payload);
			if (room) {
				state.current = room.id;
			}
			return (state);
		},
		setChatRooms: (state: State, action: PayloadAction<Array<ChatRoom>>): State => {
			state.rooms = action.payload;
			return (state);
		},
		addRoom: (state: State, action: PayloadAction<PacketPlayInChatRoomCreate>): State => {
			if (state.rooms?.find(x => x.id === action.payload.id))
				return (state);
			if (state.rooms?.find(x => x.name === action.payload.name))
				return (state);
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
			return (state);
		},
		delRoom: (state: State, action: PayloadAction<ChatRoom>): State => {
			if (action.payload.name === "World Random")
			 	return (state);
			if (action.payload.id === state.current)
				state.current = "ChatRoom_1";
			state.rooms = state.rooms?.filter(x => x.name !== action.payload.name);
			return (state);
		},
		addUser: (state: State, action: PayloadAction<Command>): State => {
			if (action.payload.cmd.length < 2)
				return (state);
			console.log(action.payload.cmd)
			state
				.rooms
				?.find(x => x.name === action.payload.cmd[1])
				?.users.push(action.payload.user.id);
			return (state);
		},
		newMessages: (state: State, action: PayloadAction<PacketPlayInChatMessage>): State => {
			state.rooms
				?.find(x => x.id === action.payload.room)
				?.messages.push(action.payload.message);
			return (state);
		},
	},
});

export const {setCurrentRooms,setChatRooms, addRoom, delRoom, newMessages, addUser} = slice.actions;
export default slice.reducer;
