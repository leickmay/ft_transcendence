import { interval } from 'rxjs';
import { Socket } from 'socket.io';
import { User } from '../../user/user.entity';
import { Directions, GameEvents, GamePacket, IPlayer, Room } from "./game.interfaces"

export class gameService {
	rooms: Array<Room> = new Array;
	privRooms: Array<Room> = new Array;
	scoreMax: number = 1;
	waitList: Array<User> = new Array;
	waitListSocket: Array<Socket> = new Array;
	raf: NodeJS.Timer;

	gameListener(packet: GamePacket, client: Socket) {
		switch (packet.id) {
			case GameEvents.JOINRAND: {
				this.joinWaitList(packet, client);
				break;
			}
			case GameEvents.CREATEPRIV: {
				this.createPrivRoom(packet, client);
				break;
			}
			case GameEvents.JOINPRIV: {
				this.joinPrivRoom(packet, client);
				break;
			}
			case GameEvents.START: {
				this.startGame(packet);
				break;
			}
			case GameEvents.CLEAR: {
				this.clearRoom(packet);
				break;
			}
			case GameEvents.MOVE: {
				this.playerChangeDir(packet);
				break;
			}
			default:
				break;
		}
	}

	joinWaitList(packet: GamePacket, client: Socket) {
		let needNew: boolean = true;
		if (this.waitList.indexOf(packet.user) === -1) {
			this.waitList.push(packet.user);
			this.waitListSocket.push(client);
			console.log("Add <", packet.user.login, "> to waitList");
		}
		else {
			//already in wait list !
			return;
		}
		if (this.waitList.length > 1) {
			if (this.rooms.length > 0) {
				this.rooms.forEach((room: Room) => {
					if (!room.isFull) {
						room.p1.user = this.waitList.shift();
						room.sockets.set(this.waitListSocket.shift(), 1);
						room.p2.user = this.waitList.shift();
						room.sockets.set(this.waitListSocket.shift(), 2);
						room.isFull = true;
						console.log("Add <", room.p1.user.login, "> and <",room.p2.user.login ,"> to existing room");
						for (const [client, sequenceNumber] of room.sockets.entries()) {
							client.emit("retJoinRoom",  room);
							room.sockets.set(client, sequenceNumber + 1);
						}
						needNew = false;
					}
				});
			}
			else if (this.rooms.length + this.privRooms.length < 42 && needNew) {
				this.rooms.push(new Room);
				this.rooms[this.rooms.length - 1].id = this.rooms.length - 1 >= 0 ? this.rooms.length - 1 : 0;
				this.rooms[this.rooms.length - 1].p1.user = this.waitList.shift();
				this.rooms[this.rooms.length - 1].sockets.set(this.waitListSocket.shift(), 1);
				this.rooms[this.rooms.length - 1].p2.user = this.waitList.shift();
				this.rooms[this.rooms.length - 1].sockets.set(this.waitListSocket.shift(), 2);
				this.rooms[this.rooms.length - 1].isFull = true;
				
				console.log("Add <", this.rooms[this.rooms.length - 1].p1.user.login, "> and <",this.rooms[this.rooms.length - 1].p2.user.login ,"> to new room");
				for (const [client, sequenceNumber] of this.rooms[this.rooms.length - 1].sockets.entries()) {
					client.emit("retJoinRoom",  this.rooms[this.rooms.length - 1]);
					this.rooms[this.rooms.length - 1].sockets.set(client, sequenceNumber + 1);
				}
			}
		}
		else {
			client.emit("retJoinRoom", null);
		}
	}

	createPrivRoom(packet: GamePacket, client: Socket) {
		if (this.privRooms.length > 1) {
			this.privRooms.forEach((room: Room) =>  {
				if (!room.p1.user) {
					room.id = this.privRooms.length - 1 >= 0 ? this.privRooms.length - 1 : 0;
					room.isPriv = true;
					room.p1.user = packet.user;
					room.sockets.set(client, 1);
					for (const [client, sequenceNumber] of room.sockets.entries()) {
						client.emit("retJoinRoom",  room);
						room.sockets.set(client, sequenceNumber + 1);
					}
				}
			})
		}
		else {
			this.privRooms.push(new Room);
			this.privRooms[this.privRooms.length - 1].id = this.privRooms.length - 1 >= 0 ? this.privRooms.length - 1 : 0;
			this.privRooms[this.privRooms.length - 1].isPriv = true;
			this.privRooms[this.privRooms.length - 1].p1.user = packet.user;
			this.privRooms[this.privRooms.length - 1].sockets.set(client, 1);
			for (const [client, sequenceNumber] of this.privRooms[this.privRooms.length - 1].sockets.entries()) {
				client.emit("retJoinRoom",  this.privRooms[this.privRooms.length - 1]);
				this.privRooms[this.privRooms.length - 1].sockets.set(client, sequenceNumber + 1);
			}
		}
	}

	joinPrivRoom(packet: GamePacket, client: Socket) {
		if (packet.roomId <= this.privRooms.length - 1) {
			this.privRooms[packet.roomId].p2.user = packet.user;
			this.privRooms[packet.roomId].sockets.set(client, 2);
			this.privRooms[packet.roomId].isFull = true;
			for (const [client, sequenceNumber] of this.privRooms[this.privRooms.length - 1].sockets.entries()) {
				client.emit("retJoinRoom",  this.privRooms[this.privRooms.length - 1]);
				this.privRooms[this.privRooms.length - 1].sockets.set(client, sequenceNumber + 1);
			}
		}
	}

	async startGame(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		//console.log(packet);
		if (!room.isStart && packet.user) {
			if (!room.p1.isReady && packet.user.login === room.p1.user.login) {
				packet.isPriv ? (this.privRooms[packet.roomId].p1.isReady = true) : (this.rooms[packet.roomId].p1.isReady = true);
			}
			if (!room.p2.isReady && packet.user.login === room.p2.user.login) {
				packet.isPriv ? (this.privRooms[packet.roomId].p2.isReady = true) : (this.rooms[packet.roomId].p2.isReady = true);
			}
			if (room.p1.isReady && room.p2.isReady) {
				packet.isPriv ? (this.privRooms[packet.roomId].isStart = true) : (this.rooms[packet.roomId].isStart = true);
			}
			for (const [client, sequenceNumber] of room.sockets.entries()) {
				client.emit("retStartRoom", packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId]);
				room.sockets.set(client, sequenceNumber + 1);
			}
			if (room.isStart === true) {
				await new Promise(r => setTimeout(r, 3000));
				this.raf = setInterval(() => {
					this.emitRoomData(packet);
				}, 24);
			}
		}
	}	

	clearRoom(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		let newRoom = new Room;
		
		for (const [client, sequenceNumber] of room.sockets.entries()) {
			client.emit("retClearRoom");
			room.sockets.set(client, sequenceNumber + 1);
		}

		newRoom.id = packet.roomId;
		room = newRoom;
		
		if (this.waitList.length > 1 && this.rooms.length < 42) {
			room.p1.user = this.waitList.shift();
			room.sockets.set(this.waitListSocket.shift(), 1);
			room.p2.user = this.waitList.shift();
			room.sockets.set(this.waitListSocket.shift(), 2);
			room.isFull = true;
			
			for (const [client, sequenceNumber] of room.sockets.entries()) {
				client.emit("retJoinRoom",  room);
				room.sockets.set(client, sequenceNumber + 1);
			}
		}
		packet.isPriv ? this.privRooms[packet.roomId] = room : this.rooms[packet.roomId] = room;
	}

	gameOver(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		packet.isPriv ? this.privRooms[packet.roomId].isOver = true : this.rooms[packet.roomId].isOver = true;
		packet.isPriv ? this.privRooms[packet.roomId].isStart : this.rooms[packet.roomId].isStart;
		clearInterval(this.raf);

		for (const [client, sequenceNumber] of room.sockets.entries()) {
			client.emit("retGameOver",  packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId]);
			room.sockets.set(client, sequenceNumber + 1);
		}
	}

	emitRoomData(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		if (!room.isOver) {
			this.playerMove(packet);
			this.ballMove(packet);
			for (const [client, sequenceNumber] of room.sockets.entries()) {
				client.emit("retRoomData",  packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId]);
				room.sockets.set(client, sequenceNumber + 1);
			}
		}

	}

	playerMove(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		if (room.p1.up && room.p1.y > 0) {
			room.p1.y -= room.p1.speed;
		}
		else if (room.p1.down && room.p1.y < room.height - room.p1.height) {
			room.p1.y += room.p1.speed;
		}

		if (room.p2.up && room.p2.y > 0) {
			room.p2.y -= room.p2.speed;
		}
		else if (room.p2.down && room.p2.y < room.height - room.p2.height) {
			room.p2.y += room.p2.speed;
		}
		packet.isPriv ? this.privRooms[packet.roomId] = room : this.rooms[packet.roomId] = room;
	}

	playerChangeDir(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		if (packet.user.login === room.p1.user.login) {
			if (packet.direction === Directions.UP) {
				room.p1.up = true;
			}
			else if (packet.direction === Directions.DOWN) {
				room.p1.down = true;
			}
			else if (packet.direction === Directions.STATIC) {
				room.p1.up = false;
				room.p1.down = false;
			}
		}
		else if (packet.user.login === room.p2.user.login) {
			if (packet.direction === Directions.UP) {
				room.p2.up = true;
			}
			else if (packet.direction === Directions.DOWN) {
				room.p2.down = true;
			}
			else if (packet.direction === Directions.STATIC) {
				room.p2.up = false;
				room.p2.down = false;
			}
		}
		packet.isPriv ? this.privRooms[packet.roomId] = room : this.rooms[packet.roomId] = room;
	}

	ballMove(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		if (room.balls[0].speedX === 0) {
			const rand = Math.floor(Math.random() * 2);
			if (rand === 0)
				room.balls[0].speedX = -10;
			else
				room.balls[0].speedX = 10;
			room.balls[0].speedY = 0;
			packet.isPriv ? this.privRooms[packet.roomId] = room : this.rooms[packet.roomId] = room;
		}
		else {
			if (room.balls[0].speedX < 0)
			{
				this.handleCollisionLeft(packet);
			}
			else if (room.balls[0].speedX >= 0) {
				this.handleCollisionRight(packet);
			}
			if (room.balls[0].speedY < 0) {
				this.handleCollisionTop(packet);
			}
			else if (room.balls[0].speedY > 0) {
				this.handleCollisionBottom(packet);
			}
			room.balls[0].x += room.balls[0].speedX;
			room.balls[0].y += room.balls[0].speedY;
			if (room.balls[0].x < 0 || room.balls[0].x > room.width) {
				if (room.balls[0].x < 0) {
						room.p2.score += 1;
						room.balls[0].speedX = -5;
					}
				else {
						room.p1.score += 1;
						room.balls[0].speedX = 5;
					}
				if (room.p2.score === this.scoreMax || room.p1.score === this.scoreMax) {
					this.gameOver(packet);
					return;
				}
				room.balls[0].x = room.width / 2;
				room.balls[0].y = room.height / 2;
				room.balls[0].speedY = 0;
				
			}
			else {
				room.balls[0].x += room.balls[0].speedX;
				room.balls[0].y += room.balls[0].speedY;
			}
			packet.isPriv ? this.privRooms[packet.roomId] = room : this.rooms[packet.roomId] = room;
		}
	}

	handleCollisionTop(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		if (room.balls[0].y - room.balls[0].size <= 0){
			room.balls[0].speedY = Math.abs(room.balls[0].speedY);
			packet.isPriv ? this.privRooms[packet.roomId] = room : this.rooms[packet.roomId] = room;
		}
	}

	handleCollisionBottom(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		if (room.balls[0].y + room.balls[0].size >= room.height){
			room.balls[0].speedY = room.balls[0].speedY * -1;
			packet.isPriv ? this.privRooms[packet.roomId] = room : this.rooms[packet.roomId] = room;
		}
	}

	handleCollisionLeft(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		if (room.balls[0].x - room.balls[0].size + room.balls[0].speedX <= room.p1.x + room.p1.width && room.balls[0].x - room.balls[0].size + room.balls[0].speedX >= room.p1.x) {
			if (room.balls[0].y + room.balls[0].size + room.balls[0].speedY >= room.p1.y && room.balls[0].y - room.balls[0].size - room.balls[0].speedY <= room.p1.y + room.p1.height ) {
				if (room.balls[0].speedX < -14)
					room.balls[0].speedX *= -1;
				else
					room.balls[0].speedX = room.balls[0].speedX * -1.1;
				var impact = room.balls[0].y - room.p1.y - room.p1.height / 2;
				var ratio = 100 / ( room.p1.height / 2);
				// Get a value between 0 and 10
				room.balls[0].speedY = Math.round(impact * ratio / 10);
				packet.isPriv ? this.privRooms[packet.roomId] = room : this.rooms[packet.roomId] = room;
			}
		}
	}

	handleCollisionRight(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		if (room.balls[0].x + room.balls[0].size + room.balls[0].speedX >= room.p2.x && room.balls[0].x + room.balls[0].size + room.balls[0].speedX <= room.p2.x + room.p2.width) {
			if (room.balls[0].y + room.balls[0].size + room.balls[0].speedY >= room.p2.y && room.balls[0].y - room.balls[0].size - room.balls[0].speedY <= room.p2.y + room.p2.height ) {
				if (room.balls[0].speedX > 14)
					room.balls[0].speedX *= -1;
				else
					room.balls[0].speedX = room.balls[0].speedX * -1.1;
				var impact = room.balls[0].y - room.p2.y - room.p2.height / 2;
				var ratio = 100 / ( room.p2.height / 2);
				// Get a value between 0 and 10
				room.balls[0].speedY = Math.round(impact * ratio / 10);
				packet.isPriv ? this.privRooms[packet.roomId] = room : this.rooms[packet.roomId] = room;
			}
		}
	}
}

