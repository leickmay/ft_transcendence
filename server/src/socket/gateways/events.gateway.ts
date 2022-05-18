import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { instanceToPlain } from 'class-transformer';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { EventsService } from '../events.service';
import { Packet, PacketPlayOutTotpStatus, PacketPlayOutUserConnection, PacketPlayOutUserDisconnected, PacketPlayOutUserUpdate } from '../packets';

@Injectable()
@WebSocketGateway(3001, { cors: true })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	constructor(
		private eventsService: EventsService,
		@Inject(forwardRef(() => AuthService))
		private authService: AuthService,
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
	) {}

	afterInit(server: Server) {
		this.eventsService.server = server;
	}

	async handleConnection(client: Socket, ...args: any[]) {
		try {
			let jwt = await this.authService.verifyJwt(
				client.handshake.headers.authorization.replace('Bearer ', '')
			);
			
			if (jwt.restricted) {
				throw Error('Operation not permited');
			}

			const user: User = await this.userService.get(jwt.id);
			if (!user || Object.values(this.eventsService.users).find(e => e.id === user.id)) {
				throw Error('Already connected');
			}
			client.broadcast.emit('user', new PacketPlayOutUserConnection([instanceToPlain(user)]));
			client.emit('user', new PacketPlayOutUserConnection(instanceToPlain(Object.values(this.eventsService.users))));
			this.eventsService.addUser(client, user);
		} catch (e) {
			client.emit('error', new UnauthorizedException());
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		let user: User = this.eventsService.users[client.id];
		if (!user)
			return;

		client.broadcast.emit('user', new PacketPlayOutUserDisconnected(user.id));
		this.eventsService.removeUser(client);
	}

	@SubscribeMessage('totp')
	async totpEvent(@MessageBody('action') action: string, @ConnectedSocket() client: Socket): Promise<void> {
		let user = this.eventsService.users[client.id];
		if (!user)
			return;

		let url: string | undefined;
		if (action == 'toggle')
			url = await this.userService.toggleTotp(user);

		client.emit('totp', new PacketPlayOutTotpStatus(url ? 'enabled' : 'disabled', url));
	}

	@SubscribeMessage('option')
	async optionEvent(@MessageBody() action: any, @ConnectedSocket() client: Socket): Promise<void> {
		console.log(action);
	}

	@SubscribeMessage('user')
	async user(@MessageBody() packet: Packet, @ConnectedSocket() client: Socket): Promise<void> {
		
	}
}
