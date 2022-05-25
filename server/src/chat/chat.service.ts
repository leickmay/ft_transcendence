import { Injectable } from "@nestjs/common";
import { EventsService } from "src/socket/events.service";
import { PacketChatIn, PacketChatOut } from "src/socket/packets/packetChat";
import { Packet, PacketInTypes } from "src/socket/packets/packets";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ChatEvents, RoomBack } from "./chat.interface";

@Injectable()
export class ChatService {

	rooms: RoomBack[] = [{
		name: "channel_World Random",
		users: [],
		isPrivateMsg: false,
		isChannel: true,
		operator: undefined,
		isPrivate: false,
		password: undefined,
		messages: [],
    }];

	constructor() {}

	dispatch(packet: Packet, user: User): void {
		let chatPacket: PacketChatIn = packet as PacketChatIn;
		switch (chatPacket.event) {
			case ChatEvents.MESSAGE:
				this.messageHandler(packet as PacketChatIn, user);
				break;
			default:
				break;
		}
	}

	async messageHandler(packet: PacketChatIn, user: User): Promise<void> {
		let room: RoomBack;
		if (packet.msg === undefined)
			return;
		
		room = this.rooms.find(x => x.name === packet.msg.to);
		room.messages.push(packet.msg);
		user?.socket.to(packet.msg.to).emit('MESSAGE', new PacketChatOut(packet.event, undefined, packet.msg));
		console.log(packet.msg);
	}
}
