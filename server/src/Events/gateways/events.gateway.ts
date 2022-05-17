import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GamePacket } from 'src/Events/game/game.interfaces';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user.entity';
import { gameService } from '../game/game.service'

@Injectable()
@WebSocketGateway(3001, { cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	connected: number;

	constructor(private authService: AuthService, private gameService: gameService) {}

	async handleConnection(client: Socket, ...args: any[]) {
		try {
			console.log('socket:', await this.authService.verifyJwt(client.handshake.headers.authorization.replace('Bearer ', '')));
		} catch (e) {
			client.emit('error', new UnauthorizedException());
			client.disconnect();
			return;
		}
	}

	handleDisconnect(client: Socket) {
		
	}

	@SubscribeMessage('increment')
	handleEvent(@MessageBody('num') num: number, @ConnectedSocket() client: Socket): number {
		client.emit("increment", {num: ++num});
		return num;
	}

	@SubscribeMessage('game')
	handleGame(@MessageBody() packet: GamePacket, @ConnectedSocket() client: Socket) {
		this.gameService.gameListener(packet);
	}

}
