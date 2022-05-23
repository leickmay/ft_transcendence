import { interval } from 'rxjs';
import { Socket } from 'socket.io';
import { User } from '../../user/user.entity';
import { Directions, GameEvents, GamePacket, IPlayer, Room } from "./game.interfaces"

export class gameService {
	rooms: Array<Room> = new Array;
	waitList: Array<User> = new Array;
	waitListSocket: Array<Socket> = new Array;

	gameListener(packet: GamePacket, client: Socket) {
		switch (packet.id) {
			case GameEvents.JOIN: {
				this.joinWaitList(packet, client);
				break;
			}
			case GameEvents.START: {
				this.startGame(packet, client);
				break;
			}
			case GameEvents.CLEAR: {
				this.clearRoom(packet, client);
				break;
			}
			case GameEvents.MOVE: {
				this.playerMove(packet);
				break;
			}
			default:
				break;
		}
	}

	joinWaitList(packet: GamePacket, client: Socket) {
		let to_emit: Map<number, Socket>;
		if (this.waitList.indexOf(packet.user) === -1) {
			this.waitList.push(packet.user);
			this.waitListSocket.push(client);
		}
		else {
			//already in wait list
			return;
		}
		if (this.waitList.length > 1) {
			this.rooms.forEach((room: Room) => {
				if (!room.isFull) {
					room.p1.user = this.waitList.shift();
					room.sockets.set(this.waitListSocket.shift(), 1);
					room.p2.user = this.waitList.shift();
					room.sockets.set(this.waitListSocket.shift(), 2);
					room.isFull = true;
				
					for (const [client, sequenceNumber] of room.sockets.entries()) {
						client.emit("retJoinRoom",  room);
						room.sockets.set(client, sequenceNumber + 1);
					}
					return;
				}
			});
			if (this.rooms.length < 42) {
				this.rooms.push(new Room);
				this.rooms[this.rooms.length - 1].id = this.rooms.length - 1;
				this.rooms[this.rooms.length - 1].p1.user = this.waitList.shift();
				this.rooms[this.rooms.length - 1].sockets.set(this.waitListSocket.shift(), 1);
				this.rooms[this.rooms.length - 1].p2.user = this.waitList.shift();
				this.rooms[this.rooms.length - 1].sockets.set(this.waitListSocket.shift(), 2);
				this.rooms[this.rooms.length - 1].isFull = true;
				
				for (const [client, sequenceNumber] of this.rooms[this.rooms.length - 1].sockets.entries()) {
					client.emit("retJoinRoom",  this.rooms[this.rooms.length - 1]);
					this.rooms[this.rooms.length - 1].sockets.set(client, sequenceNumber + 1);
				}
				return;
			}
		}
		else {
			client.emit("retJoinRoom", null);
		}
	}

	startGame(packet: GamePacket, client: Socket) {
		if (!this.rooms[packet.roomId].p1.isReady && packet.user.login === this.rooms[packet.roomId].p1.user.login) {
			this.rooms[packet.roomId].p1.isReady = true;
		}
		if (!this.rooms[packet.roomId].p2.isReady && packet.user.login === this.rooms[packet.roomId].p2.user.login) {
			this.rooms[packet.roomId].p2.isReady = true;
		}
		if (this.rooms[packet.roomId].p1.isReady && this.rooms[packet.roomId].p2.isReady) {
			this.rooms[packet.roomId].isStart = true;
			setInterval(() => {
				this.ballMove(packet);
			}, 16);
		}
		for (const [client, sequenceNumber] of this.rooms[packet.roomId].sockets.entries()) {
			client.emit("retStartRoom", this.rooms[packet.roomId]);
			this.rooms[packet.roomId].sockets.set(client, sequenceNumber + 1);
		}
	}

	clearRoom(packet: GamePacket, client: Socket) {
		let newRoom = new Room;
		newRoom.id = packet.roomId;

		for (const [client, sequenceNumber] of this.rooms[packet.roomId].sockets.entries()) {
			client.emit("retClearRoom");
			this.rooms[packet.roomId].sockets.set(client, sequenceNumber + 1);
		}

		this.rooms[packet.roomId] = newRoom;
		if (this.waitList.length > 1 && this.rooms.length < 42) {
			this.rooms[packet.roomId].p1.user = this.waitList.shift();
			this.rooms[packet.roomId].sockets.set(this.waitListSocket.shift(), 1);
			this.rooms[packet.roomId].p2.user = this.waitList.shift();
			this.rooms[packet.roomId].sockets.set(this.waitListSocket.shift(), 2);
			this.rooms[packet.roomId].isFull = true;
			
			for (const [client, sequenceNumber] of this.rooms[packet.roomId].sockets.entries()) {
				client.emit("retJoinRoom",  this.rooms[packet.roomId]);
				this.rooms[packet.roomId].sockets.set(client, sequenceNumber + 1);
			}
		}
	}

	playerMove(packet: GamePacket) {
		if (packet.user.login === this.rooms[packet.roomId].p1.user.login) {
			//console.log("p1 Move");
			if (packet.direction === Directions.UP && this.rooms[packet.roomId].p1.y > 0) {
				this.rooms[packet.roomId].p1.y -= this.rooms[packet.roomId].p1.speed;
			}
			else if (packet.direction === Directions.DOWN && this.rooms[packet.roomId].p1.y < this.rooms[packet.roomId].height - this.rooms[packet.roomId].p1.height) {
				this.rooms[packet.roomId].p1.y += this.rooms[packet.roomId].p1.speed;;
			}
			else return;
		}
		else if (packet.user.login === this.rooms[packet.roomId].p2.user.login) {
			//console.log("p2 Move");
			if (packet.direction === Directions.UP && this.rooms[packet.roomId].p2.y > 0) {
				this.rooms[packet.roomId].p2.y -= this.rooms[packet.roomId].p2.speed;;
			}
			else if (packet.direction === Directions.DOWN && this.rooms[packet.roomId].p2.y < this.rooms[packet.roomId].height - this.rooms[packet.roomId].p2.height) {
				this.rooms[packet.roomId].p2.y += this.rooms[packet.roomId].p2.speed;;
			}
			else return;
		}
		for (const [client, sequenceNumber] of this.rooms[packet.roomId].sockets.entries()) {
			client.emit("retPlayerMove",  this.rooms[packet.roomId]);
			this.rooms[packet.roomId].sockets.set(client, sequenceNumber + 1);
		}
	}

	ballMove(packet: GamePacket) {
		this.rooms[packet.roomId].balls[0].x -= this.rooms[packet.roomId].balls[0].speedX;
		this.rooms[packet.roomId].balls[0].y -= this.rooms[packet.roomId].balls[0].speedY;
		for (const [client, sequenceNumber] of this.rooms[packet.roomId].sockets.entries()) {
			client.emit("retPlayerMove",  this.rooms[packet.roomId]);
			this.rooms[packet.roomId].sockets.set(client, sequenceNumber + 1);
		}
	}
}

