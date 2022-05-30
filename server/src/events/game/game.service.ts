import { interval } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { User } from '../../user/user.entity';
import { Directions, GameEvents, GamePacket, IPlayer, Room } from "./game.interfaces"

export class gameService {
	rooms: Array<Room> = new Array;
	privRooms: Array<Room> = new Array;
	scoreMax: number = 5;
	waitList: Array<User> = new Array;
	waitListSocket: Array<Socket> = new Array;
	raf: NodeJS.Timer;

	gameListener(packet: GamePacket, client: Socket, server: Server) {
		switch (packet.id) {
			case GameEvents.JOINRAND: {
				this.joinWaitList(packet, client, server);
				break;
			}
			case GameEvents.CREATEPRIV: {
				this.createPrivRoom(packet, client, server);
				break;
			}
			case GameEvents.JOINPRIV: {
				this.joinPrivRoom(packet, client, server);
				break;
			}
			case GameEvents.START: {
				this.startGame(packet, server);
				break;
			}
			case GameEvents.CLEAR: {
				this.clearRoom(packet, server);
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

	handleGameConnection(cliLogin: string, client: Socket, server: Server) {
		this.rooms.forEach((room: Room) => {
			if (cliLogin === room.p1.user?.login || cliLogin === room.p2.user?.login) {
				return;
			}

		});
		this.privRooms.forEach((room: Room) => {
			if (cliLogin === room.p1.user?.login || cliLogin === room.p2.user?.login) {
				return;
			}

		});
	}

	handleGameDisconnection(cliLogin: string, server: Server) {
		this.rooms.forEach((room: Room) => {
			if (cliLogin === room.p1.user?.login || cliLogin === room.p2.user?.login) {
				this.clearRoom({
					id: GameEvents.CLEAR,
					user: cliLogin === room.p1.user.login ? room.p1.user.login : room.p2.user.login,
					roomId: room.id,
					isPriv: room.isPriv,
				} as GamePacket, server)
				return;
			}

		});
		this.privRooms.forEach((room: Room) => {
			if (cliLogin === room.p1.user?.login || cliLogin === room.p2.user?.login) {
				this.clearRoom({
					id: GameEvents.CLEAR,
					user: cliLogin === room.p1.user.login ? room.p1.user.login : room.p2.user.login,
					roomId: room.id,
					isPriv: room.isPriv,
				} as GamePacket, server)
				return;
			}

		});
	}

	joinWaitList(packet: GamePacket, client: Socket, server: Server) {
		if (this.waitList.indexOf(packet.user) === -1) {
			this.waitList.push(packet.user);
			this.waitListSocket.push(client);
			console.log("Add <", packet.user.login, "> to waitList");
		}
		else {
			//already in wait list 
			return;
		}
		this.joinRandRoom(packet, client, server);
	}

	joinRandRoom(packet: GamePacket, client: Socket, server: Server) {
		let needNew: boolean = true;
		if (this.waitList.length > 1) {
			if (this.rooms.length > 0) {
				this.rooms.forEach((room: Room) => {
					if (!room.isFull) {
						room.p1.user = this.waitList.shift();
						room.registerSocket(this.waitListSocket.shift());
						room.p2.user = this.waitList.shift();
						room.registerSocket(this.waitListSocket.shift());
						room.isFull = true;
						//console.log("Add <", room.p1.user.login, "> and <",room.p2.user.login ,"> to existing room");
						room.emitToAll(server, "retJoinRoom", room);
						needNew = false;
					}
				});
			}
			else if (this.rooms.length < 42 && needNew) {
				this.rooms.push(new Room);
				this.rooms[this.rooms.length - 1].id = this.rooms.length - 1 >= 0 ? this.rooms.length - 1 : 0;
				this.rooms[this.rooms.length - 1].p1.user = this.waitList.shift();
				this.rooms[this.rooms.length - 1].registerSocket(this.waitListSocket.shift());
				this.rooms[this.rooms.length - 1].p2.user = this.waitList.shift();
				this.rooms[this.rooms.length - 1].registerSocket(this.waitListSocket.shift());
				this.rooms[this.rooms.length - 1].isFull = true;
				//console.log("Add <", this.rooms[this.rooms.length - 1].p1.user.login, "> and <",this.rooms[this.rooms.length - 1].p2.user.login ,"> to new room", this.rooms[this.rooms.length - 1]);
				this.rooms[this.rooms.length - 1].emitToAll(server, "retJoinRoom", this.rooms[this.rooms.length - 1]);
			}
		}
		else {
			client.emit("retJoinRoom", null);
		}
	}

	createPrivRoom(packet: GamePacket, client: Socket, server: Server) {
		if (this.privRooms.length > 1) {
			this.privRooms.forEach((room: Room) =>  {
				if (!room.p1.user) {
					room.id = (this.privRooms.length - 1 >= 0 ? this.privRooms.length - 1 : 0);
					room.isPriv = true;
					room.p1.user = packet.user;
					room.registerSocket(client);
					room.emitToAll(server, "retJoinRoom", room);
				}
			})
		}
		else {
			this.privRooms.push(new Room);
			this.privRooms[this.privRooms.length - 1].id = (this.privRooms.length - 1 >= 0 ? this.privRooms.length - 1 : 0);
			this.privRooms[this.privRooms.length - 1].isPriv = true;
			this.privRooms[this.privRooms.length - 1].p1.user = packet.user;
			this.privRooms[this.privRooms.length - 1].registerSocket(client);
			this.privRooms[this.privRooms.length - 1].emitToAll(server, "retJoinRoom", this.privRooms[this.privRooms.length - 1]);
		}
	}

	joinPrivRoom(packet: GamePacket, client: Socket, server: Server) {
		if (packet.roomId <= this.privRooms.length - 1) {
			this.privRooms[packet.roomId].p2.user = packet.user;
			this.privRooms[packet.roomId].registerSocket(client);
			this.privRooms[packet.roomId].isFull = true;
			this.privRooms[packet.roomId].emitToAll(server, "retJoinRoom", this.privRooms[packet.roomId]);
		}
	}

	async startGame(packet: GamePacket, server: Server) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		//console.log(packet);
		if (!room) {
			return;
		}
		if (!room.isStart && packet.user) {
			if (!room.p1.isReady && packet.user.login === room.p1.user.login) {
				packet.isPriv ? (this.privRooms[packet.roomId].p1.isReady = true) : (this.rooms[packet.roomId].p1.isReady = true);
			}
			if (!room.p2.isReady && packet.user.login === room.p2.user.login) {
				packet.isPriv ? (this.privRooms[packet.roomId].p2.isReady = true) : (this.rooms[packet.roomId].p2.isReady = true);
			}
			room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
			if (room.p1.isReady && room.p2.isReady) {
				packet.isPriv ? (this.privRooms[packet.roomId].isStart = true) : (this.rooms[packet.roomId].isStart = true);
				room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
			}
			room.emitToAll(server, "retStartRoom", room);
			if (room.isStart === true) {
				await new Promise(r => setTimeout(r, 3000));
				room.raf = setInterval(() => {
					this.emitRoomData(packet, server);
				}, 16);
			}
		}
	}	

	clearRoom(packet: GamePacket, server: Server) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		let newRoom = new Room;
		
		if (room.raf) {
			clearInterval(room.raf);
		}
		room.emitToAll(server, "retClearRoom", null);

		newRoom.id = packet.roomId;
		packet.isPriv ? this.privRooms[packet.roomId] = newRoom : this.rooms[packet.roomId] = newRoom;
		
		if (this.waitList.length > 1) {
			this.joinRandRoom(packet, null, server);
		}
	}

	gameOver(packet: GamePacket, server: Server) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		room.isOver = true;
		room.isStart = false;
		clearInterval(room.raf);
		room.emitToAll(server, "retGameOver", room);
	}

	emitRoomData(packet: GamePacket, server: Server) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		if (!room.isOver) {
			this.playerMove(packet);
			this.ballMove(packet, server);
			room.emitToAll(server, "retRoomData", packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId]);
		}

	}

	playerMove(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		if (room.p1.up && room.p1.y > 0) {
			room.p1.y -= room.p1.speed;
		}
		else if (room.p1.down && room.p1.y < room.height - room.p1.height * 1.07) {
			room.p1.y += room.p1.speed;
		}

		if (room.p2.up && room.p2.y > 0) {
			room.p2.y -= room.p2.speed;
		}
		else if (room.p2.down && room.p2.y < room.height - room.p2.height * 1.07) {
			room.p2.y += room.p2.speed;
		}
		packet.isPriv ? this.privRooms[packet.roomId] = room : this.rooms[packet.roomId] = room;
	}

	playerChangeDir(packet: GamePacket) {
		let room: Room = packet.isPriv ? this.privRooms[packet.roomId] : this.rooms[packet.roomId];
		if (packet.user.login === room.p1.user.login) {
			if (packet.direction === Directions.UP) {
				room.p1.up = true;
				room.p1.paddleSrc = './assets/images/paddle1Up.png';
			}
			else if (packet.direction === Directions.DOWN) {
				room.p1.down = true;
				room.p1.paddleSrc = './assets/images/paddle1Down.png';
			}
			else if (packet.direction === Directions.STATIC) {
				room.p1.up = false;
				room.p1.down = false;
				room.p1.paddleSrc = './assets/images/paddle1.png';
			}
		}
		else if (packet.user.login === room.p2.user.login) {
			if (packet.direction === Directions.UP) {
				room.p2.up = true;
				room.p2.paddleSrc = './assets/images/paddle2Up.png';
			}
			else if (packet.direction === Directions.DOWN) {
				room.p2.down = true;
				room.p2.paddleSrc = './assets/images/paddle2Down.png';
			}
			else if (packet.direction === Directions.STATIC) {
				room.p2.up = false;
				room.p2.down = false;
				room.p2.paddleSrc = './assets/images/paddle2.png';
			}
		}
		packet.isPriv ? this.privRooms[packet.roomId] = room : this.rooms[packet.roomId] = room;
	}

	ballMove(packet: GamePacket, server: Server) {
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
					this.gameOver(packet, server);
					return;
				}
				room.balls[0].x = room.balls[0].baseX;
				room.balls[0].y = room.balls[0].baseY;
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
		if (room.balls[0].y <= 0){
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
		if (room.balls[0].x + room.balls[0].speedX <= room.p1.x + room.p1.width && room.balls[0].x + room.balls[0].speedX >= room.p1.x) {
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
		if (room.balls[0].x + room.balls[0].speedX >= room.p2.x && room.balls[0].x + room.balls[0].size + room.balls[0].speedX <= room.p2.x + room.p2.width ) {
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

