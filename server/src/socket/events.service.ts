import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class EventsService {

	server: Server | null = null;

	users: { [socket: string]: User } = {};

	constructor(
		@Inject(forwardRef(() => ChatService))
		private chatService: ChatService,
	) { }

	getServer(): Server | null {
		return this.server;
	}

	addUser(socket: Socket, user: User): void {
		this.users[socket.id] = user;
		user.socket = socket;

		this.chatService.connection(user);
	}

	removeUser(socket: Socket): void {
		this.chatService.disconnection();

		if (this.users[socket.id])
			this.users[socket.id].socket = undefined;
		delete this.users[socket.id];
	}

	getUserById(id: number): User | undefined {
		return Object.values(this.users).find(u => u.id === id);
	}

	getUserByLogin(login: string): User | undefined {
		return Object.values(this.users).find(u => u.login === login);
	}
}
