import { Injectable } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { PacketPlayInChatCreate, PacketPlayInChatJoin, PacketPlayInChatMessage } from "src/socket/packets/chat/PacketPlayInChat";
import { PacketPlayOutChatCreate, PacketPlayOutChatDel, PacketPlayOutChatInit, PacketPlayOutChatJoin } from "src/socket/packets/chat/PacketPlayOutChat";
import { PacketTypesChat, Packet } from "src/socket/packets/packetTypes";
import { User } from "src/user/user.entity";
import { ChatTypes, ChatRoom } from "./chat.interface";
import { Socket } from 'socket.io';
import { EventsService } from "src/socket/events.service";

@Injectable()
export class ChatService {

	rooms: Array<ChatRoom>;

	constructor(private eventService: EventsService) {
		this.rooms = [new ChatRoom(
			ChatTypes.CHANNEL,
			"World Random",
			true,
			[],
			undefined,
			undefined,
		)];
	}

	dispatch(packet: Packet, user: User): void {
		switch (packet.packet_id) {
			case PacketTypesChat.MESSAGE: {
				this.event_message(packet as PacketPlayInChatMessage, user);
				break;
			}
			case PacketTypesChat.CREATE: {
				this.event_create(packet as PacketPlayInChatCreate, user);
				break;
			}
			case PacketTypesChat.JOIN: {
				this.event_join(packet as PacketPlayInChatJoin, user);
				break;
			}
			case PacketTypesChat.LEAVE: {
				this.event_leave();
				break;
			}
			case PacketTypesChat.UP: {
				this.event_up();
				break;
			}
			default:
				break;
		}
	}

	connection(user: User): void {
		let worldRandom = this.rooms.find(r => r.name === "World Random");
		if (worldRandom && !(worldRandom?.isPresent(user.id)))
			worldRandom.users.push(user.id)

		this.rooms
			.filter(r => r.isPresent(user.id))
			.map((room: ChatRoom) => {
				room.join(user)
			});

		user.send('chat', new PacketPlayOutChatInit(
			instanceToPlain(
				this.rooms
					.filter(r => r.isPresent(user.id) || r.visible)
					.map((room: ChatRoom) => {
						return ({
							id: room.id,
							name: room.name,
							type: room.type,
							visible: room.visible,
							users: room.users,
							operator: room.operator,
						});
					})
			) as any
		));
	}
	disconnection() {}

	async event_command(user: User, room: ChatRoom, command: Array<string>): Promise<boolean> {
		switch (command[0]) {
			case "/EXIT": {
				if (room.name === "World Random")
					return (false);
				room.leave(user);
				if (room.users.length === 0 || room.type === ChatTypes.PRIVATE_MESSAGE) {
					this.rooms = this.rooms.filter(x => x.id !== room.id);
					user.socket?.emit('chat', new PacketPlayOutChatDel(room));
					user.socket?.broadcast.emit('chat', new PacketPlayOutChatDel(room));
				}
				return true;
			}
			default: {
				return false;
			}
		}
	}
	async event_message(packet: PacketPlayInChatMessage, user: User): Promise<void> {
		let room: ChatRoom | undefined = this.rooms.find(x => x.id === packet.room);
		if (!room?.isPresent(user.id))
			return;
		if (packet.text.startsWith('/')){
			if (await this.event_command(user, room, packet.text.split(" "))) {
				room?.command(user, packet.text);
				return;
			}
		}
		room?.send(user, packet.text);
	}
	async event_create(packet: PacketPlayInChatCreate, user: User): Promise<void> {
		switch (packet.type) {
			case ChatTypes.CHANNEL: {
				if (packet.name !== undefined && packet.visible !== undefined) {
					if (this.rooms.find(x => x.type === ChatTypes.CHANNEL && x.name === packet.name))
						return;
					let room: ChatRoom = new ChatRoom(
						ChatTypes.CHANNEL,
						packet.name,
						packet.visible,
						[user.id],
						user.id,
						packet.password,
					);
					room.join(user);
					this.rooms.push(room);

					let roomOut: PacketPlayOutChatCreate = new PacketPlayOutChatCreate(
						room.id,
						room.type,
						room.name,
						room.visible,
						room.users,
						room.operator,
					);
					user.socket?.emit('chat', roomOut);
					if (room.visible)
						user.socket?.broadcast.emit('chat', roomOut);
				}
				break;
			}
			case ChatTypes.PRIVATE_MESSAGE: {
				if (packet.users && packet.users.length === 1) {
					let otherUserID = packet.users[0];
					if (this.rooms.find(room => (room.type === ChatTypes.PRIVATE_MESSAGE && room.isPresent(user.id) && room.isPresent(otherUserID)))) {
						return;
					}
					let name = user.id.toString().padStart(8, "0") + packet.users[0].toString().padStart(8, "0");
					let room = new ChatRoom(
						ChatTypes.PRIVATE_MESSAGE,
						name,
						false,
						[user.id, otherUserID],
						undefined,
						undefined,
					);

					this.rooms.push(room);
					user.socket?.join(room.id);
					this.eventService.getUserSocket(otherUserID)?.join(room.id);

					let roomOut = new PacketPlayOutChatCreate(
						room.id,
						room.type,
						room.name,
						room.visible,
						room.users,
						room.operator,
					);

					user.socket?.emit('chat', roomOut);
					this.eventService.getUserSocket(otherUserID)?.emit('chat', roomOut);
				}
				break;
			}
			default:
				break;
		}
	}
	async event_join(packet: PacketPlayInChatJoin, user: User): Promise<void> {
		let room: ChatRoom | undefined;

		room = this.rooms.find(x => x.name === packet.name);
		if (!room || room.type === ChatTypes.PRIVATE_MESSAGE)
			return;

		if (!room.join(user, packet.password))
			return;
		
		user.socket?.emit('chat', new PacketPlayOutChatJoin({
			id: room.id,
			name: room.name,
			type: room.type,
			visible: room.visible,
			users: room.users,
			operator: room.operator,
		}));
	}
	async event_leave(): Promise<void> {}
	async event_up(): Promise<void> {}
}
