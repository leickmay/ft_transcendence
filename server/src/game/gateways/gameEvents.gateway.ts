import { SubscribeMessage, MessageBody, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

interface Room {
	player1: string;
	p1Avatar: string;
	p1PaddleX: number;
	player2: string;
	p2Avatar: string;
	p2PaddleX: number;
	BallY: number;
	isFull: boolean;
	usrsSocket: Map<any, any>;
}

@Injectable()
@WebSocketGateway(3001, { cors: true })
export class GameEventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	connected: number;

	rooms: Array<Room> = [{
		player1: "search...",
		p1Avatar: "https://t3.ftcdn.net/jpg/02/55/85/18/360_F_255851873_s0dXKtl0G9QHOeBvDCRs6mlj0GGQJwk2.jpg",
		p1PaddleX: -1,
		player2: "search...",
		p2Avatar: "https://t3.ftcdn.net/jpg/02/55/85/18/360_F_255851873_s0dXKtl0G9QHOeBvDCRs6mlj0GGQJwk2.jpg",
		p2PaddleX: -1,
		BallY: -1,
		isFull: false,
		usrsSocket: new Map(),
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
			client.emit("retJoinRoom", null);
			return;
		}
		else if (this.rooms[0].player1 === "search...")
		{
			this.rooms[0].player1 = body.name;
			this.rooms[0].p1Avatar = body.avatar;
			this.rooms[0].usrsSocket.set(client, 1);
			//console.log(this.rooms[0].usrsSocket);
			
		}
		else if (this.rooms[0].player2 === "search...")
		{
			this.rooms[0].player2 = body.name;
			this.rooms[0].p2Avatar = body.avatar;
			this.rooms[0].isFull = true;
			this.rooms[0].usrsSocket.set(client, 1);
			//tmp = this.rooms[0].usrsSocket[1];
			//tmp.emit("retJoinRoom", this.rooms[0]);
		}
		else
		{
			console.log("Room is FULL !");
			client.emit("retJoinRoom", null);
			return;
		}
		console.log("Player in Room : \nP1: ", this.rooms[0].player1, "\nP2: ", this.rooms[0].player2)	
		for (const [client, sequenceNumber] of this.rooms[0].usrsSocket.entries()) {
			client.emit("retJoinRoom",  this.rooms[0]);
			this.rooms[0].usrsSocket.set(client, sequenceNumber + 1);
		}
		return;
	}

	@SubscribeMessage('clearRoom')
	clearRoom(@MessageBody() body:any, @ConnectedSocket() client: Socket) {
		if (this.rooms[0].player1 === body.name || this.rooms[0].player2 === body.name)
			for (const [client, sequenceNumber] of this.rooms[0].usrsSocket.entries()) {
				client.emit("retClearRoom",  0);
				this.rooms[0].usrsSocket.set(client, sequenceNumber + 1);
			}
		else
			client.emit("retClearRoom",  1);
		this.rooms[0] = {
			player1: "search...",
			p1Avatar: "https://t3.ftcdn.net/jpg/02/55/85/18/360_F_255851873_s0dXKtl0G9QHOeBvDCRs6mlj0GGQJwk2.jpg",
			p1PaddleX: -1,
			player2: "search...",
			p2Avatar: "https://t3.ftcdn.net/jpg/02/55/85/18/360_F_255851873_s0dXKtl0G9QHOeBvDCRs6mlj0GGQJwk2.jpg",
			p2PaddleX: -1,
			BallY: -1,
			isFull: false,
			usrsSocket: new Map(),
		};
		//console.log("Room 0 clear : ", this.rooms[0]);
	}
}