import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Player } from 'src/game/gameEvents.entity';
import { User } from '../../user/user.entity';

enum GameEvents {
	MOVE,
}

enum Directions {
	UP,
	DOWN,
}

interface Packet {
	id: number;
}

interface PlayerMovePacket extends Packet {
	direction: Directions,
}

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

	@SubscribeMessage('game')
	handleGame(@MessageBody() packet: Packet, @ConnectedSocket() client: Socket) {
		this.gameListener(packet, users[client.id]);
	}

	// gameService.ts
	gameListener(packet: Packet, user: User) {
		let player = findPlayer(user);

		if (packet.id == GameEvents.MOVE) {
			this.move(packet as PlayerMovePacket, player);
		}
	}

	move(packet: PlayerMovePacket, player: Player) {
		if (packet.direction == Directions.UP) {
			player.y--;
		}
		if (packet.direction == Directions.DOWN) {
			player.y++;
		}
	}
}
