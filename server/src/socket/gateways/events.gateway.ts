import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';
import { OptionsService } from 'src/options/options.service';
import { SearchService } from 'src/search/search.service';
import { StatsService } from 'src/stats/stats.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { EventsService } from '../events.service';
import { PacketPlayOutUserConnection } from '../packets/PacketPlayOutUserConnection';
import { PacketPlayOutUserDisconnected } from '../packets/PacketPlayOutUserDisconnected';
import { Packet } from '../packets/packetTypes';

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
		@Inject(forwardRef(() => OptionsService))
		private optionsService: OptionsService,
		@Inject(forwardRef(() => SearchService))
		private searchService: SearchService,
		@Inject(forwardRef(() => ChatService))
		private chatService: ChatService,
		@Inject(forwardRef(() => StatsService))
		private statsService: StatsService
	) { }

	afterInit(server: Server) {
		this.eventsService.server = server;
	}

	async handleConnection(client: Socket) {
		try {
			let jwt = await this.authService.verifyJwt(
				client.handshake.headers.authorization?.replace('Bearer ', '') || ''
			);

			if (jwt.restricted) {
				throw Error('Operation not permited');
			}

			const user: User | null = await this.userService.get(jwt.id);
			if (!user || Object.values(this.eventsService.users).find(e => e.id === user.id)) {
				throw Error('Already connected');
			}
			client.emit('ready');
			client.broadcast.emit('user', new PacketPlayOutUserConnection([{id: user.id, login: user.login}]));
			client.emit('user', new PacketPlayOutUserConnection(Object.values(this.eventsService.users).map(u => ({id: u.id, login: u.login}))));
			this.eventsService.addUser(client, user);

			// To move
			await this.statsService.sendStats(user);
		} catch (e) {
			client.emit('error', new UnauthorizedException());
			this.eventsService.removeUser(client);
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		let user: User = this.eventsService.users[client.id];
		if (!user)
			return;
		client.broadcast.emit('user', new PacketPlayOutUserDisconnected({id: user.id, login: user.login}));
		this.eventsService.removeUser(client);
	}

	@SubscribeMessage('user')
	user(@MessageBody() packet: Packet, @ConnectedSocket() client: Socket): void {
		let user: User = this.eventsService.users[client.id];
		if (!user)
			return;
		this.optionsService.dispatch(packet, user);
	}

	@SubscribeMessage('chat')
	handleChat(@MessageBody() packet: Packet, @ConnectedSocket() client: Socket) {
		let user: User = this.eventsService.users[client.id];
		if (!user)
			return;
		this.chatService.dispatch(packet, user);
	}

	@SubscribeMessage('search')
	handleSearch(@MessageBody() packet: Packet, @ConnectedSocket() client: Socket) {
		let user: User = this.eventsService.users[client.id];
		if (!user)
			return;
		this.searchService.dispatch(packet, user);
	}

	@SubscribeMessage('stats')
	handleStats(@MessageBody() packet: Packet, @ConnectedSocket() client: Socket) {
		let user: User = this.eventsService.users[client.id];
		if (!user)
			return;
		this.statsService.dispatch(packet, user);
	}
}
