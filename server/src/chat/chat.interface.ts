import { Exclude, Expose, Transform } from "class-transformer";
import { PacketPlayOutChatMessage, PacketPlayOutChatOperator } from "src/socket/packets/chat/PacketPlayOutChat";
import { User } from "src/user/user.entity";

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
	users: Array<number>;

	@Expose()
	operator?: number;
	
	@Expose()
	@Transform(({value}) => !!value)
	password?: string;

	constructor(
		type: ChatTypes,
		name: string,
		visible: boolean,
		users: Array<number>,
		operator?: number,
		password?: string,
	) {
		++ChatRoom.current;
		this.id = "ChatRoom_" + ChatRoom.current;
		this.type = type;
		this.name = name;
		this.visible = visible;
		this.users = users;
		this.operator = operator;
		this.password = password;
	}

	isPresent(userID: number): boolean {
		return !!this.users.find(x => x === userID);
	}

	join(user: User, password?: string): boolean {
		if (!this.isPresent(user.id) && this.password !== password)
			return false;

		if (!this.isPresent(user.id))
			this.users.push(user.id);

		console.log("(" + user.login + ")"+ " JOIN " + this.id);
		user.socket?.join(this.id);
		return true;
	}

	leave(user: User): boolean {
		if (this.name === "World Random")
			return false;
		if (!this.isPresent(user.id))
			return false;
	
		this.users = this.users.filter(x => x !== user.id);

		if (this.operator === user.id && this.users.length > 0) {
			this.operator = this.users[0];
			let room = new PacketPlayOutChatOperator({
				id: this.id,
			 	operator: this.operator,
			})
			user.socket?.emit('chat', room);
			user.socket?.to(this.id).emit('chat', room);
		}

		user.socket?.leave(this.id);
		console.log("(" + user.login + ")"+ " LEAVE " + this.id);
		return true;
	}

	send(sender: User, text: string): void {
		let message: Message = {
			date: Date.now(),
			from: sender.login,
			text: text,
			cmd: false,
		};
		console.log("(" + sender.login + ")"+ " MESSAGE " + this.id);
		sender.socket?.emit('chat', new PacketPlayOutChatMessage(this.id, message));
		sender.socket?.to(this.id).emit('chat', new PacketPlayOutChatMessage(this.id, message));
	}

	command(sender: User, text: string): void {
		let message: Message = {
			date: Date.now(),
			from: sender.login,
			text: text,
			cmd: true,
		};
		console.log("(" + sender.login + ")"+ " COMMAND " + this.id);
		sender.socket?.emit('chat', new PacketPlayOutChatMessage(this.id, message));
		sender.socket?.to(this.id).emit('chat', new PacketPlayOutChatMessage(this.id, message));
	}
}
