import { Exclude, Expose, instanceToPlain, Transform } from "class-transformer";
import { PacketPlayOutChatMessage } from "src/socket/packets/PacketPlayOutChatMessage";
import { User } from "src/user/user.entity";

export enum ChatEvents {
	COMMAND,
	MESSAGE,
	CREATE,
	JOIN,
	UP,
	QUIT,
	DELETE,
}

export interface Message {
	date: number;
	from: string;
	text: string;
}

@Exclude()
export class Room { // instanceToPlain to send (BACK)
	private static current = 0;

	@Expose()
	id: string;

	@Expose()
	name: string;

	@Expose()
	flags: number;

	@Expose()
	operator?: string;

	@Expose()
	@Transform(({value}) => !!value)
	password?: string;

	@Expose()
	@Transform(({value}) => value.map((user: User) => user.id))
	users: Array<User>;

	constructor(name: string, flags?: number) {
		++Room.current;
		this.id = 'channel_' + Room.current;
	}

	addUser(user: User, password?: string): boolean {
		if (this.containsUser(user))
			return true;
		if (this.password !== password)
			return false;
		this.users.push(user);
		return true;
	}

	removeUser(user: User): boolean {
		// remove if not world random
		return true;
	}

	containsUser(user: User): boolean {
		return !!this.users.find(u => u.id === user.id);
	}

	send(sender: User, text: string): void {
		let message: Message = {
			date: Date.now(),
			from: sender.name,
			text: text,
		};

		sender.socket.to(this.id).emit('chat', new PacketPlayOutChatMessage(this.id, message));
	}
}

export interface Command {
	user: User;
	cmd: string[];
}
