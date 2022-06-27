import { Injectable } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { PacketPlayInChatCreate, PacketPlayInChatJoin, PacketPlayInChatMessage } from "src/socket/packets/chat/PacketPlayInChat";
import { PacketPlayOutChatBlock, PacketPlayOutChatDel, PacketPlayOutChatInit, PacketPlayOutChatJoin } from "src/socket/packets/chat/PacketPlayOutChat";
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
			default:
				break;
		}
	}

	connection(user: User): void {
		let worldRandom = this.rooms.find(r => r.name === "World Random");
		if (worldRandom && !(worldRandom?.isPresent(user.id)))
			worldRandom.users.push({id: user.id, login: user.login, name: user.name})

		this.rooms
			.filter(r => r.isPresent(user.id))
			.map((room: ChatRoom) => {
				room.join(user)
			});
		let blocked = this.usersBlocked.get(user.login);
		if (!blocked)
			blocked = [];
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
							owner: room.owner,
							admins: room.admins,
						});
					})
			) as any,
			blocked,
		));
	}
	disconnection() {}

	isBlock(user: User, login: string) {
		return (this.usersBlocked[user.login]?.find(x => x === login));
	}

	async event_command(user: User, room: ChatRoom, text: string): Promise<boolean> {
		let command = text.split(" ");
		switch (command[0].toUpperCase()) {
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
				room?.commandPublic(user, text);
				return true;
			}
			case "/PROMOTE": {
				if (command.length !== 2)
					return false;
				if (user.id !== room.owner)
					return false;
				let admin = room.users.find(x => x.login === command[1]);
				if (!admin)
					return false;
				room.addAdmin(user, admin.id);
				room?.commandPublic(user, text);
				break;
			}
			case "/DEMOTE": {
				if (command.length !== 2)
					return false;
				if (user.id !== room.owner)
					return false;
				let admin = room.users.find(x => x.login === command[1]);
				if (!admin)
					return false;
				room.delAdmin(user, admin.id);
				room?.commandPublic(user, text);
				break;
			}
			case "/PASSWORD": {
				if (command.length !== 1 && command.length !== 2)
					return false;
				if (user.id !== room.owner)
					return false;
				if (command.length === 2 && command[1].length > 32)
					return (false);
				if (command.length === 1)
					room.setPassword(undefined);
				else
					room.setPassword(command[1]);
				room?.commandPrivate(user, "Password Update");
				break;
			}
			case "/KICK": {
				if (command.length !== 2)
					return false;
				if (user.id !== room.owner && !room.isAdmins(user.id))
					return false;
				let userBan = this.eventService.getUserByLogin(command[1]);
				if (userBan === undefined || user.id === userBan.id || !room.isPresent(userBan.id))
					return false;
				if (userBan.id === room.owner)
					return false;
				let time = Date.now();
				room?.commandPublic(user, text);
				room.banUser(userBan, time)
				break;
			}
			case "/BAN": {
				if (command.length !== 3)
					return false;
				if (user.id !== room.owner && !room.isAdmins(user.id))
					return false;
				let userBan = this.eventService.getUserByLogin(command[1]);
				if (userBan === undefined || user.id === userBan.id || !room.isPresent(userBan.id))
					return false;
				if (userBan.id === room.owner)
					return false;
				let time = Date.now() + Number(command[2]) * 60 * 1000;
				room?.commandPublic(user, text);
				room.banUser(userBan, time)
				break;
			}
			case "/UNBAN": {
				if (command.length !== 2)
					return false;
				if (user.id !== room.owner && !room.isAdmins(user.id))
					return false;
				let userBan = this.eventService.getUserByLogin(command[1]);
				if (userBan === undefined || user.id === userBan.id)
					return false;
				if (userBan.id === room.owner)
					return false;
				room?.commandPublic(user, text);
				room.unbanUser(userBan, Date.now());
				break;
			}
			case "/MUTE": {
				if (command.length !== 3)
					return false;
				if (user.id !== room.owner && !room.isAdmins(user.id))
					return false;
				let userMute = this.eventService.getUserByLogin(command[1]);
				if (userMute === undefined || user.id === userMute.id || !room.isPresent(userMute.id))
					return false;
				if (userMute.id === room.owner)
					return false;
				let time = Date.now() + Number(command[2]) * 60 * 1000;
				room?.commandPublic(user, text);
				room.muteUser(userMute, time)
				break;
			}
			case "/UNMUTE": {
				if (command.length !== 2)
					return false;
				if (user.id !== room.owner && !room.isAdmins(user.id))
					return false;
				let userMute = this.eventService.getUserByLogin(command[1]);
				if (userMute === undefined || user.id === userMute.id || !room.isPresent(userMute.id))
					return false;
				if (userMute.id === room.owner)
					return false;
				room?.commandPublic(user, text);
				room.muteUser(userMute, Date.now());
				break;
			}
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
					room?.commandPrivate(user, text);
				}
				else
					return (false);
				break;
			}
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
					room?.commandPrivate(user, text);
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
		if (packet.text.length > 256) {
			packet.text = packet.text.substring(0, 256);
		}
		if (packet.text.startsWith('/')){
			if (await this.event_command(user, room, packet.text)) {
				return;
			}
		}
		else
			room?.send(user, packet.text)
	}
	async event_create(packet: PacketPlayInChatCreate, user: User): Promise<void> {
		if (packet.type === undefined)
			return;
		switch (packet.type) {
			case ChatTypes.CHANNEL: {
				if (packet.name !== undefined && packet.visible !== undefined) {
					if (packet.name.length > 16)
						break;
					if (packet.password && packet.password.length > 32)
						break;
					if (this.rooms.find(x => x.type === ChatTypes.CHANNEL && x.name === packet.name)) {
						return this.event_join(
							{name: packet.name, password: packet.password} as PacketPlayInChatJoin,
							user
						);
					}
					let room: ChatRoom = new ChatRoom(
						ChatTypes.CHANNEL,
						packet.name,
						packet.visible,
						[{id: user.id, login: user.login, name: user.name}],
						user.id,
						packet.password,
					);
					room.join(user);
					this.rooms.push(room);

					let roomOut: PacketPlayOutChatJoin = new PacketPlayOutChatJoin({
						id: room.id,
						type: room.type,
						name: room.name,
						visible: room.visible,
						users: room.users,
						owner: room.owner,
						admins: room.admins,
					});
					user.socket?.emit('chat', roomOut);
					if (room.visible)
						user.socket?.broadcast.emit('chat', roomOut);
				}
				break;
			}
			case ChatTypes.PRIVATE_MESSAGE: {
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
								{id: user.id, login: user.login, name: user.name},
								{id: otherUser.id, login: otherUser.login, name: otherUser.name},
							],
							undefined,
							undefined,
						);
						
						this.rooms.push(room);
						user.socket?.join(room.id);
						otherUser.socket?.join(room.id);
						
						let roomOut = new PacketPlayOutChatJoin({
							id: room.id,
							type: room.type,
							name: room.name,
							visible: room.visible,
							users: room.users,
							owner: room.owner,
							admins: room.admins,
						});
						
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
			owner: room.owner,
			admins: room.admins,
		}));
	}
}
