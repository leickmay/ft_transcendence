import { Injectable } from "@nestjs/common";
import { PacketPlayInChatCreate } from "src/socket/packets/InChat/PacketPlayInChatCreate";
import { PacketPlayInChatMessage } from "src/socket/packets/InChat/PacketPlayInChatMessage";
import { PacketPlayOutChatRoomCreate } from "src/socket/packets/OutChat/PacketPlayOutChatRoomCreate";
import { PacketTypesChat, Packet } from "src/socket/packets/packetTypes";
import { User } from "src/user/user.entity";
import { ChatTypes, ChatRoom } from "./chat.interface";

@Injectable()
export class ChatService {
	private worldRandom: PacketPlayInChatCreate = {
		packet_id: PacketTypesChat.CREATE,
		name: "World Random",
		visible: true,
		password: undefined,
	}
	rooms: Array<ChatRoom> = [new ChatRoom(ChatTypes.CHANNEL, this.worldRandom)];

	constructor() {}

	dispatch(packet: Packet, user: User): void {
		console.log("Dispatch ChatService")
		switch (packet.packet_id) {
			case PacketTypesChat.MESSAGE:
				console.log("Dispatch ChatService MESSAGE")
				this.messageHandler(packet as PacketPlayInChatMessage, user);
				break;
			case PacketTypesChat.CREATE:
				console.log("Dispatch ChatService CREATE")
				this.createHandler(packet as PacketPlayInChatCreate, user);
				break;
			default:
				break;
		}
	}

	getPublicRooms(): Array<ChatRoom> {
		return this.rooms;
	}

	join(user: User) {
		this.rooms.map((room) => {
			if (room.isPresent(user) || room.name === "World Random")
				room.join(user);
		})
	}

	leave(user: User) {
		this.rooms.map((room) => {
			room.leave(user);
		})
	}

	async messageHandler(packet: PacketPlayInChatMessage, user: User): Promise<void> {
		console.log(packet)
		let room: ChatRoom | undefined = this.rooms.find(x => x.id === packet.room);
		console.log(room)
		//if (room?.isPresent(user))
			room.send(user, packet.text);
	}

	async createHandler(packet: PacketPlayInChatCreate, user: User): Promise<void> {
		if (this.rooms.find(x => x.name === packet.name))
			return;

		let roomIn: ChatRoom = new ChatRoom(ChatTypes.CHANNEL, packet);
		this.rooms.push(roomIn);

		if (!roomIn.visible)
			return;

		let roomOut: PacketPlayOutChatRoomCreate = 
			new PacketPlayOutChatRoomCreate(
					roomIn.id,
					ChatTypes.CHANNEL,
					roomIn.name,
					true,
					roomIn.operator,
		);

		user.socket?.emit('chat', roomOut);
		user.socket?.broadcast.emit('chat', roomOut);
	}
}
