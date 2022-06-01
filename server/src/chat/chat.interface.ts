import { Exclude, Expose, Transform } from "class-transformer";
// import { PacketPlayOutChatMessage } from "src/socket/packets/PacketPlayOutChatMessage";
import { User } from "src/user/user.entity";

export interface Message {
	date: number;
	from: string;
	text: string;
}

export enum ChatFlags {
	CHANNEL,
	PRIVATE_MESSAGE,
}

@Exclude()
export class Room { // instanceToPlain to send (BACK)
	private static current = 0;

	@Expose()
	id: string;

	@Expose()
	name: string;

	@Expose()
	flags: ChatFlags;

	@Expose()
	operator?: string;

	@Expose()
	@Transform(({value}) => !!value)
	password?: string;

	@Expose()
	@Transform(({value}) => value.map((user: User) => user.id))
	users: Array<User>;

	constructor(name: string, flags: ChatFlags) {
		++Room.current;
		switch (flags) {
			case ChatFlags.CHANNEL:
				this.id = "channel_" + name;
				break;
			case ChatFlags.PRIVATE_MESSAGE:
				this.id = "privMsg_" + name;
				break;
			default:
				this.id = "";
				break;
		}
		this.name = name;
		this.flags = flags;
		this.operator = undefined;
		this.password = undefined;
		this.users = [];
	}

	join(user: User, password?: string): boolean {
		if (this.isPresent(user))
		{
			console.log(user.login + " join : " + this.name);
			user.socket.join(this.id);
			return true;
		}
		if (this.password !== password)
			return false;
		this.users.push(user);
		console.log(user.login + " join : " + this.name);
		user.socket.join(this.id);
		return true;
	}

	leave(user: User): boolean {
		console.log(user.login + " leave : " + this.name)
		user.socket.leave(this.name);
		return true;
	}

	isPresent(user: User): boolean {
		return !!this.users.find(u => u.id === user.id);
	}

	send(sender: User, text: string): void {
		let message: Message = {
			date: Date.now(),
			from: sender.login,
			text: text,
		};
		sender.socket.emit('chat', new PacketPlayOutChatMessage(this.id, message));
		sender.socket.to(this.id).emit('chat', new PacketPlayOutChatMessage(this.id, message));
	}
}
