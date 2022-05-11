import { SubscribeMessage, MessageBody, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';	``

interface Room {
	player1: string;
	p1Avatar: string;
	p1Up: boolean;
	p1Down: boolean;
	p1BasePos: number;
	p1Pos: number;
	player2: string;
	p2Avatar: string;
	p2Up: boolean;
	p2Down: boolean;
	p2BasePos: number;
	p2Pos: number;
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
		p1Up: false,
		p1Down: false,
		p1BasePos: 225,
		p1Pos: 225,
		player2: "search...",
		p2Avatar: "https://t3.ftcdn.net/jpg/02/55/85/18/360_F_255851873_s0dXKtl0G9QHOeBvDCRs6mlj0GGQJwk2.jpg",
		p2Up: false,
		p2Down: false,
		p2BasePos: 125,
		p2Pos: 125,
		BallY: -1,
		isFull: false,
		usrsSocket: new Map(),
	}];

	pSpeed: number = 8;

	constructor(private authService: AuthService) {}

	
	performMove() {

	}

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

	@SubscribeMessage('playerMove')
	p1Move(@MessageBody() body: any, @ConnectedSocket() client: Socket): Room | null {
		if (body.p1Up && this.rooms[0].p1Pos > this.rooms[0].p1BasePos - 245) {
			this.rooms[0].p1Pos -= this.pSpeed;
		}
		else if (body.p1Down && this.rooms[0].p1Pos < this.rooms[0].p1BasePos + 240) {
			this.rooms[0].p1Pos += this.pSpeed;
		}
		if (body.p2Up && this.rooms[0].p2Pos > this.rooms[0].p2BasePos - 245) {
			this.rooms[0].p2Pos -= this.pSpeed;
		}
		else if (body.p2Down && this.rooms[0].p2Pos < this.rooms[0].p2BasePos + 240) {
			this.rooms[0].p2Pos += this.pSpeed;
		}
		for (const [client, sequenceNumber] of this.rooms[0].usrsSocket.entries()) {
			client.emit("retPlayerMove",  this.rooms[0]);
			this.rooms[0].usrsSocket.set(client, sequenceNumber + 1);
		}
		return;
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
			
		}
		else if (this.rooms[0].player2 === "search...")
		{
			this.rooms[0].player2 = body.name;
			this.rooms[0].p2Avatar = body.avatar;
			this.rooms[0].isFull = true;
			this.rooms[0].usrsSocket.set(client, 1);
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
			p1Up: false,
			p1Down: false,
			p1BasePos: 225,
			p1Pos: 225,
			player2: "search...",
			p2Avatar: "https://t3.ftcdn.net/jpg/02/55/85/18/360_F_255851873_s0dXKtl0G9QHOeBvDCRs6mlj0GGQJwk2.jpg",
			p2Up: false,
			p2Down: false,
			p2BasePos: 125,
			p2Pos: 125,
			BallY: -1,
			isFull: false,
			usrsSocket: new Map(),
		};
		//console.log("Room 0 clear : ", this.rooms[0]);
	}
}