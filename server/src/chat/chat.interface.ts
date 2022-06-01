import { Exclude, Expose, Transform } from "class-transformer";
import { PacketPlayInChatCreate } from "src/socket/packets/InChat/PacketPlayInChatCreate";
import { PacketPlayOutChatMessage } from "src/socket/packets/OutChat/PacketPlayOutChatMessage";
import { Packet, PacketTypes } from "src/socket/packets/packetTypes";
import { User } from "src/user/user.entity";

export interface Message {
	date: number;
	from: string;
	text: string;
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
	name: string;

	@Expose()
	type: ChatTypes;

	@Expose()
	visible: boolean;

	@Expose()
	operator?: number;
	
	@Expose()
	@Transform(({value}) => !!value)
	password?: string;

	@Expose()
	@Transform(({value}) => value.map((user: User) => user.id))
	users: Array<User>;

	constructor(type: ChatTypes, packet: PacketPlayInChatCreate, user?: User) {
		++ChatRoom.current;
		switch (type) {
			case ChatTypes.CHANNEL: {
				this.id = "channel_" + packet.name;
				break;
			}
			case ChatTypes.PRIVATE_MESSAGE: {
				this.id = "privMsg_" + packet.name;
				break;
			}
			default: {
				this.id = "";
				break;
			}
		}
		this.name = packet.name;
		this.type = type;
		this.visible = packet.visible
		this.operator = user?.id;
		this.password = packet.password;
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
		sender.socket?.emit('chat', new PacketPlayOutChatMessage(this.id, message));
		sender.socket?.to(this.id).emit('chat', new PacketPlayOutChatMessage(this.id, message));
	}
}
