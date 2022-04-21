import { SubscribeMessage, MessageBody, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
@WebSocketGateway(3001, { cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	connected: number;

	constructor(private authService: AuthService) {}

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
}
