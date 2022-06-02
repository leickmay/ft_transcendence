import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatTypes, ChatRoom, Command } from "../interfaces/Chat";
import { PacketPlayInChatMessage } from "../packets/InChat/PacketPlayInChatMessage";
import { PacketPlayInChatRoomCreate } from "../packets/InChat/PacketPlayInChatRoomCreate";
import store from "../store";

interface State {
	current: string;
	rooms: Array<ChatRoom>;
}

const worldRandom: ChatRoom = {
	type: ChatTypes.CHANNEL,
	id: "channel_World Random",
	name: "World Random",
	messages: [],
	operator: undefined,
	visible: true,
	users: [],
}

const initialState: State = {
	current: worldRandom.id,
	rooms: [worldRandom],
};

const slice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setCurrentRooms: (state: State, action: PayloadAction<string>): State => {
			let room = state.rooms.find(x => x.id === action.payload);
			if (room) {
				state.current = room.id;
			}
			return (state);
		},
		addRoom: (state: State, action: PayloadAction<PacketPlayInChatRoomCreate>): State => {
			if (state.rooms.find(x => x.id === action.payload.id))
				return (state);
			if (state.rooms.find(x => x.name === action.payload.name))
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
			state.rooms.push(room);
			return (state);
		},
		delRoom: (state: State, action: PayloadAction<ChatRoom>): State => {
			if (action.payload.id === worldRandom.id)
			 	return (state);
			if (action.payload.id === state.current)
				state.current = worldRandom.id;
			state.rooms = state.rooms.filter(x => x.name !== action.payload.name);
			return (state);
		},
		addUser: (state: State, action: PayloadAction<Command>): State => {
			if (action.payload.cmd.length < 2)
				return (state);
			console.log(action.payload.cmd)
			state
				.rooms
				.find(x => x.name === action.payload.cmd[1])
				?.users.push(action.payload.user.id);
			return (state);
		},
		newMessages: (state: State, action: PayloadAction<PacketPlayInChatMessage>): State => {
			state.rooms
				.find(x => x.id === action.payload.room)
				?.messages.push(action.payload.message);
			return (state);
		},
	},
});

export const {setCurrentRooms, addRoom, delRoom, newMessages, addUser} = slice.actions;
export default slice.reducer;
