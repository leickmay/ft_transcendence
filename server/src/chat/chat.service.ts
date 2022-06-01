import { Injectable } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { PacketPlayInChatMessage } from "src/socket/packets/PacketPlayInChatMessage";
import { PacketPlayOutChatRoomList } from "src/socket/packets/PacketPlayOutChatRoomList";
import { PacketTypesChat, Packet } from "src/socket/packets/packetTypes";
import { User } from "src/user/user.entity";
import { ChatFlags, Room } from "./chat.interface";

@Injectable()
export class ChatService {
	rooms: Array<Room> = [new Room("World Random", ChatFlags.CHANNEL)];

	constructor() {}

	dispatch(packet: Packet, user: User): void {
		switch (packet.packet_id) {
			case PacketTypesChat.MESSAGE:
				this.messageHandler(packet as PacketPlayInChatMessage, user);
				break;
			default:
				break;
		}
	}

	getPublicRooms(): Array<Room> {
		return this.rooms;
	}

	join(user: User) {
		user.send('chat', new PacketPlayOutChatRoomList(instanceToPlain(this.getPublicRooms().map((room: Room) => {
			return {id: room.id, name: room.name};
		})) as any));
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
		let room: Room | undefined = this.rooms.find(x => x.id === packet.room);
		if (room?.isPresent(user))
			room.send(user, packet.text);
	}
}
