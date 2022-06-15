import { Injectable } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { PacketPlayInChatCreate, PacketPlayInChatJoin, PacketPlayInChatMessage } from "src/socket/packets/chat/PacketPlayInChat";
import { PacketPlayOutChatCreate, PacketPlayOutChatDel, PacketPlayOutChatInit, PacketPlayOutChatJoin } from "src/socket/packets/chat/PacketPlayOutChat";
import { PacketTypesChat, Packet } from "src/socket/packets/packetTypes";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ChatTypes, ChatRoom } from "./chat.interface";
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {

	rooms: Array<ChatRoom>;
	sockets: {[user: number]: Socket | undefined} = {};

	constructor(private userService: UserService) {
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
			case PacketTypesChat.COMMAND: {
				//this.event_command();
				break;
			}
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
		this.sockets[user.id] = user.socket;

		let worldRandom: ChatRoom | undefined;
		worldRandom =  this.rooms.find(r => r.name === "World Random");
		if (worldRandom && !(worldRandom?.isPresent(user.id)))
			worldRandom.users.push(user.id)

		this.rooms
			.filter(r => r.isPresent(user.id))
			.map((room: ChatRoom) => {
				room.join(user)
			});

		console.log(this.rooms
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
			}))

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
	disconnection(user: User) {
		delete this.sockets[user.id]
		//this.rooms.map((room) => {
		//	room.leave(user);
		//	if (room.users.length === 0 || room.type === ChatTypes.PRIVATE_MESSAGE) {
		//		this.rooms = this.rooms.filter(x => x.id !== room.id);
		//		user.socket?.broadcast.emit('chat', new PacketPlayOutChatDel(room));
		//	}
		//});
	}

	async event_command(user: User, room: ChatRoom, command: Array<string>): Promise<boolean> {
		console.log(command)
		switch (command[0]) {
			case "/EXIT": {
				if (room.name === "World Random")
					return (false);
				room.leave(user);
				console.log("lenght : " + room.users.length)
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
		console.log(packet)
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
					let tmp = this.rooms.find(r => (
						r.type === ChatTypes.PRIVATE_MESSAGE
						&& r.isPresent(user.id)
						&& r.isPresent(otherUserID)))
					if (tmp) {
						tmp.join(user);
						let roomOut: PacketPlayOutChatCreate = new PacketPlayOutChatCreate(
							tmp.id,
							tmp.type,
							tmp.name,
							tmp.visible,
							tmp.users,
							tmp.operator,
						);
				
						user.socket?.emit('chat', roomOut);
						if (tmp.visible)
							user.socket?.broadcast.emit('chat', roomOut);
						return;
					}
					let name: string = user.id.toString().padStart(8, "0") + packet.users[0].toString().padStart(8, "0");
					console.log(name);
					let room: ChatRoom = new ChatRoom(
						ChatTypes.PRIVATE_MESSAGE,
						name,
						false,
						[user.id, otherUserID],
						undefined,
						undefined,
					);

					this.rooms.push(room);
					user.socket?.join(room.id);

					this.sockets[otherUserID]?.join(room.id);

					let roomOut = new PacketPlayOutChatCreate(
						room.id,
						room.type,
						room.name,
						room.visible,
						room.users,
						room.operator,
					);

					user.socket?.emit('chat', roomOut);
					this.sockets[otherUserID]?.emit('chat', roomOut);
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
		if (!room)
			return;
		
		if (room.type === ChatTypes.PRIVATE_MESSAGE)
			return;
		
		//if (!room.visible)
		//	this.upRoom(user, room);

		if (!room.join(user, packet.password))
			return;
			
		let roomOut = new PacketPlayOutChatJoin({
			id: room.id,
			name: room.name,
			type: room.type,
			visible: room.visible,
			users: room.users,
			operator: room.operator,
		});
		console.log(roomOut)
		user.socket?.emit('chat', roomOut);
		//room.command(user, "/JOIN " + room.name);
	}
	async event_leave(): Promise<void> {

	}
	async event_up(): Promise<void> {
		
	}


	getPublicRooms(): Array<ChatRoom> {
		return this.rooms;
	}

//	join(user: User) {
//		this.rooms.map((room) => {
//			if (room.isPresent(user) || room.name === "World Random") {
//				this.upRoom(user, room);
//				room.join(user);
//				room.command(user, "/JOIN " + room.name);
//			}
//		})
//	}
//
//	leave(user: User) {
//		this.rooms.map((room) => {
//			room.leave(user);
//		});
//	}

//	async commandHandler(packet: PacketPlayInChatMessage, user: User): Promise<void> {
//		let room: ChatRoom | undefined = this.rooms.find(x => x.id === packet.room);
//		if (room?.isPresent(user))
//			room?.command(user, packet.text);
//	}
//
//	async messageHandler(packet: PacketPlayInChatMessage, user: User): Promise<void> {
//		if (packet.text.startsWith('\\')) {
//			this.commandHandler(packet, user);
//			return;
//		}
//
//		let room: ChatRoom | undefined = this.rooms.find(x => x.id === packet.room);
//		if (room?.isPresent(user))
//			room?.send(user, packet.text);
//	}
//
//	async createHandler(packet: PacketPlayInChatCreate, user: User): Promise<void> {
//		if (this.rooms.find(x => x.name === packet.name))
//			return;
//
//		let roomIn: ChatRoom = new ChatRoom(ChatTypes.CHANNEL, packet, user);
//		roomIn.join(user);
//		this.rooms.push(roomIn);
//
//		this.upRoom(user, roomIn);
//	}
//
//	async joinHandler(packet: PacketPlayInChatJoin, user: User): Promise<void> {
//		let room: ChatRoom | undefined;
//
//		room = this.rooms.find(x => x.name === packet.name);
//		if (!room)
//			return;
//		
//		if (room.type === ChatTypes.PRIVATE_MESSAGE)
//			return;
//		
//		if (!room.visible)
//			this.upRoom(user, room);
//
//		room.join(user, packet.password)
//		room.command(user, "/JOIN " + room.name);
//	}
}
