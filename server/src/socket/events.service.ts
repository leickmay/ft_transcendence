import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class EventsService {

	server: Server = null;

	users: { [socket: string]: User } = {};

	constructor() { }

	getServer(): Server {
		return this.server;
	}

	addUser(socket: Socket, user: User): void {
		this.users[socket.id] = user;
		user.socket = socket;
	}

	removeUser(socket: Socket): void {
		this.users[socket.id].socket = undefined;
		delete this.users[socket.id];
	}
}
