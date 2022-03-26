import { SubscribeMessage, MessageBody, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3001, { cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	connected: number;

	handleConnection(client: Socket, ...args: any[]) {
		
	}

	handleDisconnect(client: Socket) {
		
	}

	@SubscribeMessage('increment')
	handleEvent(@MessageBody('num') num: number, @ConnectedSocket() client: Socket): number {
		client.emit("increment", {num: ++num});
		return num;
	}
}
