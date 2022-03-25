import { SubscribeMessage, MessageBody, WebSocketGateway, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(3001, { cors: true })
export class EventsGateway {

	@SubscribeMessage('events')
	handleEvent(@MessageBody('id') id: number, @ConnectedSocket() client: Socket): number {
		client.emit("meuh", id);
		return id;
	}
}
