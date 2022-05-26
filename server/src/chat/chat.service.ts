import { Injectable } from "@nestjs/common";
import { PacketPlayInChatMessage } from "src/socket/packets/in/PacketPlayInChatMessage";
import { PacketPlayOutChatMessage } from "src/socket/packets/out/PacketPlayOutChatMessage";
import { ChatPacketTypes, Packet, PacketTypes} from "src/socket/packets/packetTypes";
import { User } from "src/user/user.entity";
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
		switch (packet.packet_id) {
			case ChatPacketTypes.CHAT_MESSAGE:
				this.messageHandler(packet as PacketPlayInChatMessage, user);
				break;
			default:
				break;
		}
	}

	async messageHandler(packet: PacketPlayInChatMessage, user: User): Promise<void> {
		let room: RoomBack;
		if (packet.msg === undefined)
			return;
		
		room = this.rooms.find(x => x.name === packet.msg.to);
		room.messages.push(packet.msg);
		user?.socket.to(packet.msg.to).emit('MESSAGE', new PacketPlayOutChatMessage(packet.packet_id, packet.msg));
		console.log(packet.msg);
	}
}
