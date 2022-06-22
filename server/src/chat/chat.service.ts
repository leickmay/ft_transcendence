import { Injectable } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { PacketPlayInChatCreate, PacketPlayInChatJoin, PacketPlayInChatMessage } from "src/socket/packets/chat/PacketPlayInChat";
import { PacketPlayOutChatBlock, PacketPlayOutChatCreate, PacketPlayOutChatDel, PacketPlayOutChatInit, PacketPlayOutChatJoin } from "src/socket/packets/chat/PacketPlayOutChat";
import { PacketTypesChat, Packet } from "src/socket/packets/packetTypes";
import { User } from "src/user/user.entity";
import { ChatTypes, ChatRoom } from "./chat.interface";
import { EventsService } from "src/socket/events.service";

@Injectable()
export class ChatService {

	rooms: Array<ChatRoom>;

	usersBlocked: Map<string, Array<string>>;

	constructor(private eventService: EventsService) {
		this.rooms = [new ChatRoom(
			ChatTypes.CHANNEL,
			"World Random",
			true,
			[],
			undefined,
			undefined,
		)];
		this.usersBlocked = new Map<string, Array<string>>();
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
			worldRandom.users.push({id: user.id, login: user.login})

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
			) as any,
			this.usersBlocked[user.login],
		));
	}
	disconnection() {}

	isBlock(user: User, login: string) {
		return (this.usersBlocked[user.login]?.find(x => x === login));
	}

	async event_command(user: User, room: ChatRoom, text: string): Promise<boolean> {
		let command = text.split(" ");
		switch (command[0]) {
			// EXIT
			case "/EXIT": {
				if (command.length !== 1)
					return false;
				if (room.name === "World Random")
					return (false);
				room.leave(user);
				if (room.users.length === 0 || room.type === ChatTypes.PRIVATE_MESSAGE) {
					this.rooms = this.rooms.filter(x => x.id !== room.id);
					user.socket?.emit('chat', new PacketPlayOutChatDel(room));
					user.socket?.broadcast.emit('chat', new PacketPlayOutChatDel(room));
				}
				room?.command(user, text);
				return true;
			}
			// OPERATOR login
			case "/OPERATOR": {
				if (command.length !== 2)
					return false;
				if (user.id !== room.operator)
					return false;
				let operator = this.eventService.getUserByLogin(command[1]);
				if (!operator)
					return false;
				room.setOperator(user, operator.id);
				room?.command(user, text);
				break;
			}
			// PASSWORD *****
			case "/PASSWORD": {
				if (command.length !== 2)
					return false;
				if (user.id !== room.operator)
					return false;
				room.setPassword(command[1]);
				room?.command(user, text);
				break;
			}
			// DELPASSWORD
			case "/DELPASSWORD": {
				if (command.length !== 1)
					return false;
				if (user.id !== room.operator)
					return false;
				room.setPassword(undefined);
				room?.command(user, text);
				break;
			}
			// BAN login time
			case "/BAN": {
				if (command.length !== 3)
					return false;
				if (user.id !== room.operator)
					return false;
				let userBan = this.eventService.getUserByLogin(command[1]);
				if (userBan === undefined )
					return false;
				if (user.id === userBan.id)
					return false;
				let time = Date.now() + Number(command[2]) * 60 * 1000;
				room?.command(user, text);
				room.banUser(userBan, time)
				break;
			}
			// UNBAN login
			case "/UNBAN": {
				if (command.length !== 2)
					return false;
				if (user.id !== room.operator)
					return false;
				let userBan = this.eventService.getUserByLogin(command[1]);
				if (userBan === undefined )
					return false;
				if (user.id === userBan.id)
					return false;
				let time = 0;
				room?.command(user, text);
				room.banUser(userBan, time)
				break;
			}
			// MUTE login times
			case "/MUTE": {
				if (command.length !== 3)
					return false;
				if (user.id !== room.operator)
					return false;
				let userMute = this.eventService.getUserByLogin(command[1]);
				if (userMute === undefined )
					return false;
				if (user.id === userMute.id)
					return false;
				let time = Date.now() + Number(command[2]) * 60 * 1000;
				room?.command(user, text);
				room.muteUser(userMute, time)
				break;
			}
			// UNMUTE login
			case "/UNMUTE": {
				if (command.length !== 2)
					return false;
				if (user.id !== room.operator)
					return false;
				let userMute = this.eventService.getUserByLogin(command[1]);
				if (userMute === undefined )
					return false;
				if (user.id === userMute.id)
					return false;
				room?.command(user, text);
				room.muteUser(userMute, Date.now());
				break;
			}
			//BLOCK login
			case "/BLOCK": {
				if (command.length !== 2)
					return false;
				let userBlocked = this.eventService.getUserByLogin(command[1]);
				if (!userBlocked || userBlocked.login === user.login)
					return (false);
				if (userBlocked && !this.isBlock(user, userBlocked.login)) {
					let tmp = this.usersBlocked.get(user.login);
					if (tmp)
						this.usersBlocked.set(user.login, [
							...tmp,
							userBlocked.login,
						]);
					else
						this.usersBlocked.set(user.login, [
							userBlocked.login,
						]);
				}
				let tmp = this.usersBlocked.get(user.login);
				if (tmp)
				{
					user.socket?.emit('chat', new PacketPlayOutChatBlock(tmp));
					room?.command(user, text);
				}
				else
					return (false);
				break;
			}
			//UNBLOCK login
			case "/UNBLOCK": {
				if (command.length !== 2)
					return false;
				let userBlocked = this.eventService.getUserByLogin(command[1]);
				if (!userBlocked || userBlocked.login === user.login)
					return (false);
				if (userBlocked && !this.isBlock(user, userBlocked.login)) {
					let tmp = this.usersBlocked.get(user.login)?.filter(x => x !== userBlocked?.login);
					if (tmp)
						this.usersBlocked.set(user.login, [
							...tmp,
						]);
				}
				let tmp = this.usersBlocked.get(user.login);
				if (tmp)
				{
					user.socket?.emit('chat', new PacketPlayOutChatBlock(tmp));
					room?.command(user, text);
				}
				else
					return (false);
				break;
			}
			default: {
				return false;
			}
		}
		return true;
	}
	async event_message(packet: PacketPlayInChatMessage, user: User): Promise<void> {
		if (packet.room === undefined || packet.text === undefined)
			return;
		let room: ChatRoom | undefined = this.rooms.find(x => x.id === packet.room);
		if (!room?.isPresent(user.id))
			return;
		if (packet.text.length >= 256) {
			packet.text = packet.text.substring(0, 255);
		}
		if (packet.text.startsWith('/')){
			if (await this.event_command(user, room, packet.text)) {
				return;
			}
		}
		room?.send(user, packet.text)
	}
	async event_create(packet: PacketPlayInChatCreate, user: User): Promise<void> {
		if (packet.type === undefined)
			return;
		switch (packet.type) {
			case ChatTypes.CHANNEL: {
				if (packet.name !== undefined && packet.visible !== undefined) {
					if (packet.name.length >= 32)
						packet.name = packet.name.substring(0, 31);
					if (packet.password && packet.password.length >= 256)
						packet.password = packet.password.substring(0, 255);
					if (this.rooms.find(x => x.type === ChatTypes.CHANNEL && x.name === packet.name))
						return;
					let room: ChatRoom = new ChatRoom(
						ChatTypes.CHANNEL,
						packet.name,
						packet.visible,
						[{id: user.id, login: user.login}],
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
				//let otherUser = this.eventService.getUser(packet.users[0]);
				if (packet.users && packet.users.length === 1) {
					let otherUser = this.eventService.getUserById(packet.users[0]);
					if (otherUser)
					{
						if (this.usersBlocked.get(otherUser.login)?.find(x => x === user.login))
							return;
						if (this.rooms.find(room => (
							room.type === ChatTypes.PRIVATE_MESSAGE 
							&& room.isPresent(user.id) 
							&& otherUser && room.isPresent(otherUser.id)))) {
								return;
						}
						let name = user.id.toString().padStart(8, "0") + packet.users[0].toString().padStart(8, "0");
						let room = new ChatRoom(
							ChatTypes.PRIVATE_MESSAGE,
							name,
							false,
							[
								{id: user.id, login: user.login},
								{id: otherUser.id, login: otherUser.login},
							],
							undefined,
							undefined,
						);
						
						this.rooms.push(room);
						user.socket?.join(room.id);
						otherUser.socket?.join(room.id);
						
						let roomOut = new PacketPlayOutChatCreate(
							room.id,
							room.type,
							room.name,
							room.visible,
							room.users,
							room.operator,
						);
						
						user.socket?.emit('chat', roomOut);
						otherUser.socket?.emit('chat', roomOut);
					}
				}
				break;
			}
			default:
				break;
		}
	}
	async event_join(packet: PacketPlayInChatJoin, user: User): Promise<void> {
		if (packet.name === undefined)
			return;
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
