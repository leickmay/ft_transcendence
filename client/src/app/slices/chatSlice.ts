import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, Room } from "../interfaces/Chat";

interface State {
	current: number;
	rooms: Array<Room>;
}

const initialState: State = {
	current: 0,
	rooms: []
};

const slice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setCurrentRooms: (state: State, action: PayloadAction<string>): State => {
			// let room: Room | undefined = state.rooms.find(x => x.name === action.payload);
			// if (room) {
			// 	state.currentRooms = room;
			// }
			return (state);
		},
		addRoom: (state: State, action: PayloadAction<Room>): State => {
			// let room: Room | undefined = state.rooms.find(x => x.name === action.payload.name);
			// if (room === undefined) {
			// 	state.rooms.push(action.payload);
			// }
			return (state);
		},
		delRoom: (state: State, action: PayloadAction<Room>): State => {
			// if (action.payload.name === "channel_World Random")
			// 	return (state);
			// state.rooms = state.rooms.filter(x => x.name !== action.payload.name);
			// let room: Room | undefined = state.rooms.find(x => x.name === "channel_World Random");
			// if (room !== undefined)
			// 	state.currentRooms = room;
			return (state);
		},
		newMessages: (state: State, action: PayloadAction<Message>): State => {
			// let room: Room | undefined = state.rooms.find(x => x.name === action.payload.to);
			// room?.messages.push(action.payload);
			// if (state.currentRooms.name === action.payload.to && room)
			// 	state.currentRooms = room;
			return (state);
		}
	},
});

export const {setCurrentRooms, addRoom, delRoom, newMessages} = slice.actions;
export default slice.reducer;
