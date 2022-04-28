import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
@WebSocketGateway(3001, { cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	users: {[socket: string]: User} = {};

	constructor(private authService: AuthService, private userService: UserService) {}

	async handleConnection(client: Socket, ...args: any[]) {
		try {
			const user: User = await this.userService.get((
				await this.authService.verifyJwt(
					client.handshake.headers.authorization.replace('Bearer ', '')
				)).id
			);
			if (Object.values(this.users).find(e => e.id === user.id))
				throw Error('Already connected');

			client.broadcast.emit('online', user);
			client.emit('already-online', Object.values(this.users));
			this.users[client.id] = user;
		} catch (e) {
			client.emit('error', new UnauthorizedException());
			client.disconnect();
			return;
		}
	}

	handleDisconnect(client: Socket) {
		client.broadcast.emit('offline', this.users[client.id]);
		delete this.users[client.id];
	}

	@SubscribeMessage('friend')
	async handleEvent(@MessageBody('action') action: string, @MessageBody('id') id: number, @ConnectedSocket() client: Socket): Promise<void> {
		if (action == 'add') {
			let target = await this.userService.get(id);

			if (target) {
				this.users[client.id].friends.push(target);
			}
		}
	}
}
