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
				this.JoinWaitList(packet, client);
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

	async JoinWaitList(packet: GamePacket, client: Socket) {
		if (this.waitList.indexOf(packet.user) === -1) {
			this.waitList.push(packet.user);
			this.waitListSocket.push(client);
		}
		else {
			//already in wait list

			return;
		}
		if (this.waitList.length > 1 && this.rooms.length < 42) {
			this.rooms.push(new Room);
			this.rooms[this.rooms.length - 1].id = this.rooms.length - 1;
			this.rooms[this.rooms.length - 1].p1.user = this.waitList.shift();
			this.rooms[this.rooms.length - 1].sockets.set(1, this.waitListSocket.shift());
			this.rooms[this.rooms.length - 1].p2.user = this.waitList.shift();
			this.rooms[this.rooms.length - 1].sockets.set(2, this.waitListSocket.shift());
			this.rooms[this.rooms.length - 1].isFull = true;
			for (const [sequenceNumber, client] of this.rooms[this.rooms.length - 1].sockets.entries()) {
				client.emit("retJoinRoom", this.rooms[this.rooms.length - 1])
				this.rooms[this.rooms.length - 1].sockets.set(sequenceNumber , client + 1);
			}
		}
		else {
			client.emit("retJoinRoom", null);
		}
	}

	playerMove(packet: GamePacket) {
		if (packet.user.login === this.rooms[packet.roomId].p1.user.login) {
			if (packet.direction == Directions.UP) {
				this.rooms[packet.roomId].p1.y--;
			}
			if (packet.direction == Directions.DOWN) {
				this.rooms[packet.roomId].p1.y++;
			}
		}
		else if (packet.user.login === this.rooms[packet.roomId].p2.user.login) {
			if (packet.direction == Directions.UP) {
				this.rooms[packet.roomId].p2.y--;
			}
			if (packet.direction == Directions.DOWN) {
				this.rooms[packet.roomId].p2.y++;
			}
		}
		for (const [sequenceNumber, client] of this.rooms[packet.roomId].sockets.entries()) {
			client.emit("retPlayerMove", this.rooms[packet.roomId])
			this.rooms[packet.roomId].sockets.set(sequenceNumber , client + 1);
		}
	}
}
