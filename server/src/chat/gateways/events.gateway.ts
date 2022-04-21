import { SubscribeMessage, MessageBody, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { GetUserDto } from 'src/user/dto/getUser.dto';
import { User } from 'src/user/user.entity';
import { use } from 'passport';

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

	// @SubscribeMessage('increment')
	// handleEvent(@MessageBody('num') num: number, @ConnectedSocket() client: Socket): number {
	// 	client.emit("increment", {num: ++num});
	// 	return num;
	// }
}
