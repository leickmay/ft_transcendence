import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { instanceToPlain } from 'class-transformer';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { EventsService } from '../events.service';

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

			client.broadcast.emit('online', instanceToPlain(user));
			client.emit('already-online', instanceToPlain(Object.values(this.eventsService.users)));
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

		client.broadcast.emit('offline', instanceToPlain(user));
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

		client.emit('totp', {status: 'success', totp: url});
	}

	@SubscribeMessage('option')
	async optionEvent(@MessageBody('action') action: string, @MessageBody('id') id: number, @ConnectedSocket() client: Socket): Promise<void> {
		
	}

	@SubscribeMessage('friend')
	async friendEvent(@MessageBody('action') action: string, @MessageBody('id') id: number, @ConnectedSocket() client: Socket): Promise<void> {
		let user = this.eventsService.users[client.id];
		if (!user)
			return;

		let friends = await user.friends;
		if (action == 'add') {
			let target = await User.findOne(id);

			if (target && !friends.find(o => o.id === id)) {
				friends.push(target);
			}

			user.friends = Promise.resolve(friends);
			await (await user.save()).reload();
		} else if (action == 'remove') {
			let target = await User.findOne(id);

			if (target) {
				friends = friends.filter(e => e.id != target.id);
			}

			user.friends = Promise.resolve(friends);
			await (await user.save()).reload();
		} else if (action == 'get') {
		}
		client.emit('friends', instanceToPlain(await user.friends));
	}
}
