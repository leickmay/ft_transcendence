import { Injectable } from "@nestjs/common";
import { PacketPlayInChatCreate } from "src/socket/packets/InChat/PacketPlayInChatCreate";
import { PacketPlayInChatJoin } from "src/socket/packets/InChat/PacketPlayInChatJoin";
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
		switch (packet.packet_id) {
			case PacketTypesChat.MESSAGE:
				this.messageHandler(packet as PacketPlayInChatMessage, user);
				break;
			case PacketTypesChat.CREATE:
				this.createHandler(packet as PacketPlayInChatCreate, user);
				break;
			case PacketTypesChat.JOIN:
				this.joinHandler(packet as PacketPlayInChatJoin, user);
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
			if (room.isPresent(user) || room.name === "World Random") {
				this.upRoom(user, room);
				room.join(user);
				room.command(user, "/JOIN " + room.name);
			}
		})
	}

	leave(user: User) {
		this.rooms.map((room) => {
			room.leave(user);
		})
	}

	upRoom(user: User, room: ChatRoom) {
		let roomOut: PacketPlayOutChatRoomCreate;

		roomOut = new PacketPlayOutChatRoomCreate(
					room.id,
					ChatTypes.CHANNEL,
					room.name,
					room.visible,
					room.users,
					room.operator,
		);

		user.socket?.emit('chat', roomOut);
		if (room.visible)
			user.socket?.broadcast.emit('chat', roomOut);
	}

	async commandHandler(packet: PacketPlayInChatMessage, user: User): Promise<void> {
		let room: ChatRoom | undefined = this.rooms.find(x => x.id === packet.room);
		if (room?.isPresent(user))
			room?.command(user, packet.text);
	}

	async messageHandler(packet: PacketPlayInChatMessage, user: User): Promise<void> {
		if (packet.text.startsWith('\\')) {
			this.commandHandler(packet, user);
			return;
		}

		let room: ChatRoom | undefined = this.rooms.find(x => x.id === packet.room);
		if (room?.isPresent(user))
			room?.send(user, packet.text);
	}

	async createHandler(packet: PacketPlayInChatCreate, user: User): Promise<void> {
		if (this.rooms.find(x => x.name === packet.name))
			return;

		let roomIn: ChatRoom = new ChatRoom(ChatTypes.CHANNEL, packet, user);
		roomIn.join(user);
		this.rooms.push(roomIn);

		this.upRoom(user, roomIn);
	}

	async joinHandler(packet: PacketPlayInChatJoin, user: User): Promise<void> {
		let room: ChatRoom | undefined;

		room = this.rooms.find(x => x.name === packet.name);
		if (!room)
			return;
		
		if (room.type === ChatTypes.PRIVATE_MESSAGE)
			return;
		
		if (!room.visible)
			this.upRoom(user, room);

		room.join(user, packet.password)
		room.command(user, "/JOIN " + room.name);
	}
}
