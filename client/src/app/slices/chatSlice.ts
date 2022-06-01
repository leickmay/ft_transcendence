import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatFlags, Room } from "../interfaces/Chat";
import { PacketPlayInChatMessage } from "../packets/PacketPlayInChatMessage";

interface State {
	current: string;
	rooms: Array<Room>;
}

const worldRandom: Room = {
	id: "channel_World Random",
	name: "World Random",
	messages: [],
	operator: undefined,
	flags: ChatFlags.CHANNEL,
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
		addRoom: (state: State, action: PayloadAction<Room>): State => {
			if (state.rooms.find(x => x.id === action.payload.id))
				return (state);
			if (state.rooms.find(x => x.name === action.payload.name))
				return (state);
			state.rooms.push(action.payload);
			return (state);
		},
		delRoom: (state: State, action: PayloadAction<Room>): State => {
			if (action.payload.id === worldRandom.id)
			 	return (state);
			if (action.payload.id === state.current)
				state.current = worldRandom.id;
			state.rooms = state.rooms.filter(x => x.name !== action.payload.name);
			return (state);
		},
		newMessages: (state: State, action: PayloadAction<PacketPlayInChatMessage>): State => {
			state.rooms
				.find(x => x.id === action.payload.room)
				?.messages.push(action.payload.message);
			return (state);
		}
	},
});

export const {setCurrentRooms, addRoom, delRoom, newMessages} = slice.actions;
export default slice.reducer;
