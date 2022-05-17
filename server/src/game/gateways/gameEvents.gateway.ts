import { SubscribeMessage, MessageBody, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Room } from "../../Events/game/game.interfaces"

@Injectable()
@WebSocketGateway(3001, { cors: true })
export class GameEventsGateway implements OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	connected: number;

	rooms: Array<Room> = new Array;

	constructor(private authService: AuthService) {}

	async handleDisconnect(client: Socket) {
		try {
			console.log('Disconnection to Game socket:', await this.authService.verifyJwt(client.handshake.headers.authorization.replace('Bearer ', '')));
		} catch (e) {
			client.emit('Error', new UnauthorizedException());
			client.disconnect();
			return;
		}
	}

	/*newRoom(isClear: boolean): Room {
		var newRoom: Room = new Room;
		var newP1: Player = new Player;
		var newP2: Player = new Player;
		var newBall: Ball = new Ball;
		

		newRoom.id = this.rooms.length === 0 ? 0 : (isClear ? this.rooms[this.rooms.length - 1].id : this.rooms[this.rooms.length - 1].id + 1);
		newRoom.height = 1080;
		newRoom.width = 1920;
		newP1.user = null;
		newP1.height = newRoom.height / 8;
		newP1.width = newRoom.width / 100;
		newP1.baseY = newRoom.height / 2 - (newP1.height / 2);
		newP1.y = newP1.baseY;
		newP1.x = newRoom.width / 100;
		newP1.up = false;
		newP1.down = false;
		newP1.speed = 12;
		newP2.user = null;
		newP2.baseY = newRoom.height / 2 - (newP1.height / 2);
		newP2.y = newP2.baseY;
		newP2.x = newRoom.width / 100 * 99; 
		newP2.up = false;
		newP2.down = false;
		newP2.speed = 12;
		newRoom.p1 = newP1;
		newRoom.p2 = newP2;
		newBall.baseX = newRoom.width / 2;
		newBall.baseY = newRoom.height / 2;
		newBall.x = newBall.baseX;
		newBall.y = newBall.baseY;
		newBall.speedX = 6;
		newBall.speedY = 6;
		newRoom.balls = new Array;
		newRoom.balls.push(newBall);
		newRoom.isFull = false;
		newRoom.sockets = new Map;
		return (newRoom);
	}

	@SubscribeMessage('joinRoom')
	joinRoom(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		var needNew: boolean = true;

		this.rooms.forEach((room: Room) => {
			if (!room.isFull) {
				needNew = false;
			}
			if ((room.p1.user && body.user.login === room.p1.user.login) || (room.p2.user && body.user.login === room.p2.user.login)) {
				console.log(body.name, "Already in room");
				client.emit("retJoinRoom", null);
				return;
			}
		})
		if (needNew) {
			this.rooms.push(this.newRoom(false));
			this.rooms[this.rooms.length - 1].p1.user = body.user;
			this.rooms[this.rooms.length - 1].sockets.set(client, 1);
			for (const [client, sequenceNumber] of this.rooms[this.rooms.length - 1].sockets.entries()) {
				client.emit("retJoinRoom",  this.rooms[this.rooms.length - 1]);
				this.rooms[this.rooms.length - 1].sockets.set(client, sequenceNumber + 1);
			}
			return;
		}
		else {
			this.rooms.forEach((room: Room) => {
				if (!room.p1.user) {
					room.p1.user = body.user;
					room.sockets.set(client, 1);
					for (const [client, sequenceNumber] of this.rooms[this.rooms.length - 1].sockets.entries()) {
						client.emit("retJoinRoom",  this.rooms[this.rooms.length - 1]);
						this.rooms[this.rooms.length - 1].sockets.set(client, sequenceNumber + 1);
					}
					return;
				}
				else if (!room.p2.user) {
					room.p2.user = body.user;
					room.sockets.set(client, 1);
					room.isFull = true;
					for (const [client, sequenceNumber] of this.rooms[this.rooms.length - 1].sockets.entries()) {
						client.emit("retJoinRoom",  this.rooms[this.rooms.length - 1]);
						this.rooms[this.rooms.length - 1].sockets.set(client, sequenceNumber + 1);
					}
					return;
				}
			});
		}
	}

	@SubscribeMessage('clearRoom')
	clearRoom(@MessageBody() body:any, @ConnectedSocket() client: Socket) {
		for (const [client, sequenceNumber] of this.rooms[body.id].sockets.entries()) {
				client.emit("retClearRoom",  this.rooms[body.id]);
				this.rooms[body.id].sockets.set(client, sequenceNumber + 1);
			}
		this.rooms[body.id] = this.newRoom(true);
	}

	@SubscribeMessage('playerMove')
	playerMove(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		if (body.p1Up && this.rooms[body.id].p1.y > this.rooms[body.id].p1.baseY - 245) {
			this.rooms[body.id].p1.y -= this.rooms[body.id].p1.speed;
		}
		else if (body.p1Down && this.rooms[body.id].p1.y < this.rooms[body.id].p1.baseY + 240) {
			this.rooms[body.id].p1.y += this.rooms[body.id].p1.speed;
		}
		if (body.p2Up && this.rooms[body.id].p2.y > this.rooms[body.id].p2.baseY - 245) {
			this.rooms[body.id].p2.y -= this.rooms[body.id].p2.speed;
		}
		else if (body.p2Down && this.rooms[body.id].p2.y < this.rooms[body.id].p2.baseY + 240) {
			this.rooms[body.id].p2.y += this.rooms[body.id].p2.speed;
		}
		for (const [client, sequenceNumber] of this.rooms[body.id].sockets.entries()) {
			client.emit("retPlayerMove",  this.rooms[body.id]);
			this.rooms[body.id].sockets.set(client, sequenceNumber + 1);
		}
		return;
	}

	@SubscribeMessage('ballMove')
	ballMove(@MessageBody() body: any, @ConnectedSocket() client: Socket){
		if ((this.rooms[body.id].balls[0].y < this.rooms[body.id].balls[0].baseY - 265)
			|| this.rooms[body.id].balls[0].y > this.rooms[body.id].balls[0].baseY + 265) {
			this.rooms[body.id].balls[0].speedY *= -1;
		}
		if ((this.rooms[body.id].balls[0].x < this.rooms[body.id].balls[0].baseX - 415)
			|| (this.rooms[body.id].balls[0].x > this.rooms[body.id].balls[0].baseX + 415)) {
			this.rooms[body.id].balls[0].speedX *= -1;
		}
		this.rooms[body.id].balls[0].y -= this.rooms[body.id].balls[0].speedY;
		this.rooms[body.id].balls[0].x -= this.rooms[body.id].balls[0].speedX;
		for (const [client, sequenceNumber] of this.rooms[body.id].sockets.entries()) {
			client.emit("retBallMove",  this.rooms[body.id]);
			this.rooms[body.id].sockets.set(client, sequenceNumber + 1);
		}
		return;
	}*/
}