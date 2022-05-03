import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { instanceToPlain } from 'class-transformer';
import * as OTPAuth from 'otpauth';
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
			if (Object.values(this.users).find(e => e.id === user.id)) {
				throw Error('Already connected');
			}

			client.broadcast.emit('online', instanceToPlain(user));
			client.emit('already-online', instanceToPlain(Object.values(this.users)));
			this.users[client.id] = user;
		} catch (e) {
			client.emit('error', new UnauthorizedException());
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		client.broadcast.emit('offline', instanceToPlain(this.users[client.id]));
		delete this.users[client.id];
	}

	@SubscribeMessage('totp')
	async totpEvent(@MessageBody('action') action: string, @ConnectedSocket() client: Socket): Promise<void> {
		let user = this.users[client.id];

		if (action == 'add') {
			let totp = new OTPAuth.TOTP({
				issuer: 'Stonks Pong 3000',
				label: this.users[client.id].login,
				algorithm: 'SHA1',
				digits: 6,
				period: 30,
			});

			user.totp = totp.secret.base32;
			await user.save();
			client.emit('totp', {status: 'enabled', payload: totp.toString()});
		} else if (action == 'remove' && this.users[client.id].totp) {
			user.totp = null;
			await user.save();
			client.emit('totp', {status: 'disabled'});
		} else {
			client.emit('totp', {status: 'unknown'});
		}
	}

	@SubscribeMessage('friend')
	async friendEvent(@MessageBody('action') action: string, @MessageBody('id') id: number, @ConnectedSocket() client: Socket): Promise<void> {
		let user = this.users[client.id];

		let friends = await user.friends;
		if (action == 'add') {
			let target = await this.userService.get(id);

			if (target && !friends.find(o => o.id === id)) {
				friends.push(target);
			}

			user.friends = Promise.resolve(friends);
			await (await user.save()).reload();
		} else if (action == 'remove') {
			let target = await this.userService.get(id);

			if (target) {
				friends = friends.filter(e => e.id != target.id);
			}

			user.friends = Promise.resolve(friends);
			await (await user.save()).reload();
		} else if (action == 'get') {
		}
		client.emit('friends', instanceToPlain(await user.friends))
	}
}
