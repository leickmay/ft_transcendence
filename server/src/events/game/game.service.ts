import { interval } from 'rxjs';
import { Socket } from 'socket.io';
import { User } from '../../user/user.entity';
import { Directions, GameEvents, GamePacket, IPlayer, Room } from "./game.interfaces"

export class gameService {
	rooms: Array<Room> = new Array;
	scoreMax: number = 1;
	waitList: Array<User> = new Array;
	waitListSocket: Array<Socket> = new Array;
	raf: NodeJS.Timer;

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
			else if (this.rooms.length < 42 && needNew) {
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

	async startGame(packet: GamePacket, client: Socket) {
		if (!this.rooms[packet.roomId].isStart) {
			if (!this.rooms[packet.roomId].p1.isReady && packet.user.login === this.rooms[packet.roomId].p1.user.login) {
				this.rooms[packet.roomId].p1.isReady = true;
			}
			if (!this.rooms[packet.roomId].p2.isReady && packet.user.login === this.rooms[packet.roomId].p2.user.login) {
				this.rooms[packet.roomId].p2.isReady = true;
			}
			if (this.rooms[packet.roomId].p1.isReady && this.rooms[packet.roomId].p2.isReady) {
				this.rooms[packet.roomId].isStart = true;
			}
			for (const [client, sequenceNumber] of this.rooms[packet.roomId].sockets.entries()) {
				client.emit("retStartRoom", this.rooms[packet.roomId]);
				this.rooms[packet.roomId].sockets.set(client, sequenceNumber + 1);
			}
			if (this.rooms[packet.roomId].isStart === true) {
				await new Promise(r => setTimeout(r, 3000));
				this.raf = setInterval(() => {
					this.emitRoomData(packet);
				}, 24);
			}
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

	gameOver(packet: GamePacket) {
		this.rooms[packet.roomId].isOver = true;
		this.rooms[packet.roomId].isStart = false;
		clearInterval(this.raf);

		for (const [client, sequenceNumber] of this.rooms[packet.roomId].sockets.entries()) {
			client.emit("retGameOver",  this.rooms[packet.roomId]);
			this.rooms[packet.roomId].sockets.set(client, sequenceNumber + 1);
		}
	}

	emitRoomData(packet: GamePacket) {
		if (!this.rooms[packet.roomId].isOver) {
			this.playerMove(packet);
			this.ballMove(packet);
		}

		for (const [client, sequenceNumber] of this.rooms[packet.roomId].sockets.entries()) {
			client.emit("retRoomData",  this.rooms[packet.roomId]);
			this.rooms[packet.roomId].sockets.set(client, sequenceNumber + 1);
		}
	}

	playerMove(packet: GamePacket) {
			if (this.rooms[packet.roomId].p1.up && this.rooms[packet.roomId].p1.y > 0) {
				this.rooms[packet.roomId].p1.y -= this.rooms[packet.roomId].p1.speed;
			}
			else if (this.rooms[packet.roomId].p1.down && this.rooms[packet.roomId].p1.y < this.rooms[packet.roomId].height - this.rooms[packet.roomId].p1.height) {
				this.rooms[packet.roomId].p1.y += this.rooms[packet.roomId].p1.speed;
			}

			if (this.rooms[packet.roomId].p2.up && this.rooms[packet.roomId].p2.y > 0) {
				this.rooms[packet.roomId].p2.y -= this.rooms[packet.roomId].p2.speed;
			}
			else if (this.rooms[packet.roomId].p2.down && this.rooms[packet.roomId].p2.y < this.rooms[packet.roomId].height - this.rooms[packet.roomId].p2.height) {
				this.rooms[packet.roomId].p2.y += this.rooms[packet.roomId].p2.speed;
			}
	}

	playerChangeDir(packet: GamePacket) {
		if (packet.user.login === this.rooms[packet.roomId].p1.user.login) {
			if (packet.direction === Directions.UP) {
				this.rooms[packet.roomId].p1.up = true;
			}
			else if (packet.direction === Directions.DOWN) {
				this.rooms[packet.roomId].p1.down = true;
			}
			else if (packet.direction === Directions.STATIC) {
				this.rooms[packet.roomId].p1.up = false;
				this.rooms[packet.roomId].p1.down = false;
			}
		}
		else if (packet.user.login === this.rooms[packet.roomId].p2.user.login) {
			if (packet.direction === Directions.UP) {
				this.rooms[packet.roomId].p2.up = true;
			}
			else if (packet.direction === Directions.DOWN) {
				this.rooms[packet.roomId].p2.down = true;
			}
			else if (packet.direction === Directions.STATIC) {
				this.rooms[packet.roomId].p2.up = false;
				this.rooms[packet.roomId].p2.down = false;
			}
		}
	}

	ballMove(packet: GamePacket) {

		if (this.rooms[packet.roomId].balls[0].speedX === 0) {
			const rand = Math.floor(Math.random() * 2);
			if (rand === 0)
				this.rooms[packet.roomId].balls[0].speedX = -10;
			else
				this.rooms[packet.roomId].balls[0].speedX = 10;
			this.rooms[packet.roomId].balls[0].speedY = 0;
		}
		else {
			if (this.rooms[packet.roomId].balls[0].speedX < 0)
			{
				this.handleCollisionLeft(packet);
			}
			else if (this.rooms[packet.roomId].balls[0].speedX >= 0) {
				this.handleCollisionRight(packet);
			}
			if (this.rooms[packet.roomId].balls[0].speedY < 0) {
				this.handleCollisionTop(packet);
			}
			else if (this.rooms[packet.roomId].balls[0].speedY > 0) {
				this.handleCollisionBottom(packet);
			}
			this.rooms[packet.roomId].balls[0].x += this.rooms[packet.roomId].balls[0].speedX;
			this.rooms[packet.roomId].balls[0].y += this.rooms[packet.roomId].balls[0].speedY;
			if (this.rooms[packet.roomId].balls[0].x < 0 || this.rooms[packet.roomId].balls[0].x > this.rooms[packet.roomId].width) {
				if (this.rooms[packet.roomId].balls[0].x < 0) {
						this.rooms[packet.roomId].p2.score += 1;
						this.rooms[packet.roomId].balls[0].speedX = -5;
					}
				else {
						this.rooms[packet.roomId].p1.score += 1;
						this.rooms[packet.roomId].balls[0].speedX = 5;
					}
				if (this.rooms[packet.roomId].p2.score === this.scoreMax || this.rooms[packet.roomId].p1.score === this.scoreMax) {
					this.gameOver(packet);
					return;
				}
				this.rooms[packet.roomId].balls[0].x = this.rooms[packet.roomId].width / 2;
				this.rooms[packet.roomId].balls[0].y = this.rooms[packet.roomId].height / 2;
				this.rooms[packet.roomId].balls[0].speedY = 0;
				
			}
			else {
				this.rooms[packet.roomId].balls[0].x += this.rooms[packet.roomId].balls[0].speedX;
				this.rooms[packet.roomId].balls[0].y += this.rooms[packet.roomId].balls[0].speedY;
			}
	
		}
	}

	handleCollisionTop(packet: GamePacket) {
		if (this.rooms[packet.roomId].balls[0].y - this.rooms[packet.roomId].balls[0].size <= 0){
			this.rooms[packet.roomId].balls[0].speedY = Math.abs(this.rooms[packet.roomId].balls[0].speedY);
		}
	}

	handleCollisionBottom(packet: GamePacket) {
		if (this.rooms[packet.roomId].balls[0].y + this.rooms[packet.roomId].balls[0].size >= this.rooms[packet.roomId].height){
			this.rooms[packet.roomId].balls[0].speedY = this.rooms[packet.roomId].balls[0].speedY * -1;
		}
	}

	handleCollisionLeft(packet: GamePacket) {
		if (this.rooms[packet.roomId].balls[0].x - this.rooms[packet.roomId].balls[0].size + this.rooms[packet.roomId].balls[0].speedX <= this.rooms[packet.roomId].p1.x + this.rooms[packet.roomId].p1.width && this.rooms[packet.roomId].balls[0].x - this.rooms[packet.roomId].balls[0].size + this.rooms[packet.roomId].balls[0].speedX >= this.rooms[packet.roomId].p1.x) {
			if (this.rooms[packet.roomId].balls[0].y + this.rooms[packet.roomId].balls[0].size + this.rooms[packet.roomId].balls[0].speedY >= this.rooms[packet.roomId].p1.y && this.rooms[packet.roomId].balls[0].y - this.rooms[packet.roomId].balls[0].size - this.rooms[packet.roomId].balls[0].speedY <= this.rooms[packet.roomId].p1.y + this.rooms[packet.roomId].p1.height ) {
				if (this.rooms[packet.roomId].balls[0].speedX < -14)
					this.rooms[packet.roomId].balls[0].speedX *= -1;
				else
					this.rooms[packet.roomId].balls[0].speedX = this.rooms[packet.roomId].balls[0].speedX * -1.1;
				var impact = this.rooms[packet.roomId].balls[0].y - this.rooms[packet.roomId].p1.y - this.rooms[packet.roomId].p1.height / 2;
				var ratio = 100 / ( this.rooms[packet.roomId].p1.height / 2);
				// Get a value between 0 and 10
				this.rooms[packet.roomId].balls[0].speedY = Math.round(impact * ratio / 10);
			}
		}
	}

	handleCollisionRight(packet: GamePacket) {
		if (this.rooms[packet.roomId].balls[0].x + this.rooms[packet.roomId].balls[0].size + this.rooms[packet.roomId].balls[0].speedX >= this.rooms[packet.roomId].p2.x && this.rooms[packet.roomId].balls[0].x + this.rooms[packet.roomId].balls[0].size + this.rooms[packet.roomId].balls[0].speedX <= this.rooms[packet.roomId].p2.x + this.rooms[packet.roomId].p2.width) {
			if (this.rooms[packet.roomId].balls[0].y + this.rooms[packet.roomId].balls[0].size + this.rooms[packet.roomId].balls[0].speedY >= this.rooms[packet.roomId].p2.y && this.rooms[packet.roomId].balls[0].y - this.rooms[packet.roomId].balls[0].size - this.rooms[packet.roomId].balls[0].speedY <= this.rooms[packet.roomId].p2.y + this.rooms[packet.roomId].p2.height ) {
				if (this.rooms[packet.roomId].balls[0].speedX > 14)
					this.rooms[packet.roomId].balls[0].speedX *= -1;
				else
					this.rooms[packet.roomId].balls[0].speedX = this.rooms[packet.roomId].balls[0].speedX * -1.1;
				var impact = this.rooms[packet.roomId].balls[0].y - this.rooms[packet.roomId].p2.y - this.rooms[packet.roomId].p2.height / 2;
				var ratio = 100 / ( this.rooms[packet.roomId].p2.height / 2);
				// Get a value between 0 and 10
				this.rooms[packet.roomId].balls[0].speedY = Math.round(impact * ratio / 10);
			}
		}
	}
}

