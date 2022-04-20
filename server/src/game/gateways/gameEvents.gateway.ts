import { SubscribeMessage, MessageBody, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

interface Room {
	player1: string;
	p1PaddleX: number;
	player2: string;
	p2PaddleX: number;
	BallY: number;
}

@Injectable()
@WebSocketGateway(3001, { cors: true })
export class GameEventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	connected: number;

	rooms: Array<Room> = [{
		player1: "",
		p1PaddleX: -1,
		player2: "",
		p2PaddleX: -1,
		BallY: -1 
	}];

	constructor(private authService: AuthService) {}

	async handleConnection(client: Socket, ...args: any[]) {
		try {
			console.log('Connection to Game socket:', await this.authService.verifyJwt(client.handshake.headers.authorization.replace('Bearer ', '')));
		} catch (e) {
			client.emit('Error', new UnauthorizedException());
			client.disconnect();
			return;
		}
	}

	async handleDisconnect(client: Socket) {
		try {
			console.log('Disconnection to Game socket:', await this.authService.verifyJwt(client.handshake.headers.authorization.replace('Bearer ', '')));
		} catch (e) {
			client.emit('Error', new UnauthorizedException());
			client.disconnect();
			return;
		}
	}

	@SubscribeMessage('increment')
	handleEvent(@MessageBody('num') num: number, @ConnectedSocket() client: Socket): number {
		client.emit("increment", {num: ++num});
		return num;
	}

	@SubscribeMessage('joinRoom')
	joinRoom(@MessageBody() body: any, @ConnectedSocket() client: Socket): Room | null {
		if (this.rooms[0].player1 === body.name || this.rooms[0].player2 === body.name)
		{
			console.log(body.name, " Already in room");
			this.server.emit("retJoinRoom", null);
			return;
		}
		else if (this.rooms[0].player1 === "")
			this.rooms[0].player1 = body.name;
		else if (this.rooms[0].player2 === "")
			this.rooms[0].player2 = body.name;
		else
		{
			console.log("Room is FULL !");
			this.server.emit("retJoinRoom", null);
			return;
		}
		console.log("Player in Room : \nP1: ", this.rooms[0].player1, "\nP2: ", this.rooms[0].player2)
		this.server.emit("retJoinRoom", this.rooms[0]);
		return;
	}

	@SubscribeMessage('clearRoom')
	clearRoom(@MessageBody() body:any, @ConnectedSocket() client: Socket) {
		this.rooms[0] = {
			player1: "",
			p1PaddleX: -1,
			player2: "",
			p2PaddleX: -1,
			BallY: -1 
		};
		console.log("Room 0 clear : ", this.rooms[0]);
	}
}