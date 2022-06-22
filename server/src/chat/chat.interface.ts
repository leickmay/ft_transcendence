import { Exclude, Expose, Transform } from "class-transformer";
import { PacketPlayOutChatAdmin, PacketPlayOutChatMessage, PacketPlayOutChatOwner } from "src/socket/packets/chat/PacketPlayOutChat";
import { User, UserPreview } from "src/user/user.entity";

export interface Message {
	date: number;
	from: string;
	text: string;
	cmd: boolean;
}

export enum ChatTypes {
	CHANNEL,
	PRIVATE_MESSAGE,
}

@Exclude()
export class ChatRoom { // instanceToPlain to send (BACK)
	private static current = 0;

	@Expose()
	id: string;

	@Expose()
	type: ChatTypes;

	@Expose()
	name: string;

	@Expose()
	visible: boolean;

	@Expose()
	users: Array<{id: number, login: string}>;

	@Expose()
	ban: Array<{id: Number, time: number}>;

	@Expose()
	mute: Array<{id: Number, time: number}>;

	@Expose()
	owner?: number;

	@Expose()
	admins: Array<number>;
	
	@Expose()
	@Transform(({value}) => !!value)
	password?: string;

	constructor(
		type: ChatTypes,
		name: string,
		visible: boolean,
		users: Array<UserPreview>,
		owner?: number,
		password?: string,
	) {
		++ChatRoom.current;
		this.id = "ChatRoom_" + ChatRoom.current;
		this.type = type;
		this.name = name;
		this.visible = visible;
		this.users = users;
		this.owner = owner;
		this.admins = [];
		this.password = password;
		this.ban = [];
		this.mute = [];
	}

	banUser(user: User, time: number) {
		let tmp = this.ban.find(x => x.id === user.id)
		if (tmp === undefined) {
			this.ban = [
				...this.ban,
				{id: user.id, time: time},
			];
		}
		else
			tmp.time = time;
		this.leave(user);
	}

	isBan(userID: number): boolean {
		let user = this.ban.find(x => x.id == userID);
		if (user === undefined)
			return false;
		if (user.time < Date.now())
			return false;
		return true;
	}
	
	muteUser(user: User, time: number) {
		let tmp = this.mute.find(x => x.id === user.id)
		if (tmp === undefined) {
			this.mute = [
				...this.mute,
				{id: user.id, time: time},
			];
		}
		else
			tmp.time = time;
	}

	unmuteUser(user: User, time: number) {

	}

	isMute(userID: number): boolean {
		let user = this.mute.find(x => x.id == userID);
		if (user === undefined)
			return false;
		if (user.time < Date.now())
			return false;
		return true;
	}

	setPassword(password: string | undefined) {
		if (password)
			this.password = password.substring(0, 255);
		else
			this.password = undefined;
	}

	dellPassword() {
		this.password = undefined;
	}

	setOwner(user: User, id: number) {
		this.owner = id;
		let room = new PacketPlayOutChatOwner({
			id: this.id,
			owner: this.owner,
		})
		user.socket?.emit('chat', room);
		user.socket?.to(this.id).emit('chat', room);
	}

	addAdmin(user: User, id: number) {
		if (this.admins.find(x => x === id))
			return;
		this.admins = [
			...this.admins,
			id,
		];
		let room = new PacketPlayOutChatAdmin({
			id: this.id,
			admins: this.admins,
		})
		console.log(room.room.admins)
		user.socket?.emit('chat', room);
		user.socket?.to(this.id).emit('chat', room);
	}

	delAdmin(user: User, id: number) {
		if (!this.admins.find(x => x === id))
			return;
		this.admins = [
			...this.admins.filter(x => x !== id),
		];
		let room = new PacketPlayOutChatAdmin({
			id: this.id,
			admins: this.admins,
		})
		user.socket?.emit('chat', room);
		user.socket?.to(this.id).emit('chat', room);
	}

	isPresent(userID: number): boolean {
		return !!this.users.find(x => x.id === userID);
	}

	join(user: User, password?: string): boolean {
		if (!this.isPresent(user.id) && this.password !== password)
			return false;
		if (this.isBan(user.id))
			return false;

		if (!this.isPresent(user.id))
			this.users.push({id: user.id, login: user.login});

		user.socket?.join(this.id);
		return true;
	}

	leave(user: User): boolean {
		if (this.name === "World Random")
			return false;
		if (!this.isPresent(user.id))
			return false;
	
		this.users = this.users.filter(x => x.id !== user.id);

		if (this.owner === user.id && this.users.length > 0) {
			this.owner = this.users[0].id;
			let room = new PacketPlayOutChatOwner({
				id: this.id,
			 	owner: this.owner,
			})
			user.socket?.emit('chat', room);
			user.socket?.to(this.id).emit('chat', room);
		}

		user.socket?.leave(this.id);
		return true;
	}

	send(sender: User, text: string): void {
		if (this.isMute(sender.id))
			return;
		let message: Message = {
			date: Date.now(),
			from: sender.login,
			text: text,
			cmd: false,
		};
		sender.socket?.emit('chat', new PacketPlayOutChatMessage(this.id, message));
		sender.socket?.to(this.id).emit('chat', new PacketPlayOutChatMessage(this.id, message));
	}

	command(sender: User, text: string): void {
		if (this.isMute(sender.id))
			return;
		let message: Message = {
			date: Date.now(),
			from: sender.login,
			text: text,
			cmd: true,
		};
		sender.socket?.emit('chat', new PacketPlayOutChatMessage(this.id, message));
		sender.socket?.to(this.id).emit('chat', new PacketPlayOutChatMessage(this.id, message));
	}
}
