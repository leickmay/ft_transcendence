import { Exclude, Expose, instanceToPlain } from "class-transformer";
import { Server } from "socket.io";
import { PacketPlayOutBallsMove } from "src/socket/packets/PacketPlayOutBallsMove";
import { PacketPlayOutPlayerJoin } from "src/socket/packets/PacketPlayOutPlayerJoin";
import { PacketPlayOutPlayerList } from "src/socket/packets/PacketPlayOutPlayerList";
import { PacketPlayOutPlayerMove } from "src/socket/packets/PacketPlayOutPlayerMove";
import { PacketPlayOutPlayerReady } from "src/socket/packets/PacketPlayOutPlayerReady";
import { clearInterval } from "timers";
import { User } from "../user/user.entity";

export interface Entity {
	x: number;
	y: number;

	resetLocation(): void;
}

export enum Sides {
	RIGHT,
	LEFT,
}

export enum Directions {
	UP,
	DOWN,
	STATIC,
}

export interface Spectator {
	user: User;
}

export class Room {
	private static current = 0;

	private interval?: NodeJS.Timer;

	readonly height: number = 1080;
	readonly width: number = 1920;
	readonly minPlayers = 2;
	readonly maxPlayers = 2;

	id: number;
	isPriv: boolean = false;
	isOver: boolean = false;

	players: Array<Player> = [];
	readonly balls: Array<Ball> = [];
	spectators: Array<Spectator> = [];

	maxScore: number = 5;

	constructor(private readonly server: Server) {
		this.id = ++Room.current;
		this.balls.push(new Ball(this, this.height / 80, 4));
		//this.balls.push(new Ball(this, this.height / 80, 8));
	}

	private chooseSide(): Sides {
		return this.players.filter(p => p.side === Sides.LEFT).length > this.players.length / 2 ? Sides.RIGHT : Sides.LEFT;
	}

	private getSocketRoom(): string {
		return 'game_' + this.id.toString();
	}

	canStart(): boolean { return this.players[0]?.isReady() && this.players[1]?.isReady() }
	isFull(): boolean { return this.players.length >= this.maxPlayers; }

	join(user: User): void {
		
		if (!this.isFull()) {
			user.send('game', new PacketPlayOutPlayerList(instanceToPlain(this.players))); // TODO classtransformer

			let player = new Player(user, this, this.chooseSide(), this.width / 40, this.height / 4);

			user.player = player;
			this.players.push(player);

			user.socket?.join(this.getSocketRoom());
			this.broadcast(new PacketPlayOutPlayerJoin(instanceToPlain(user.player))); // TODO classtransformer
		}
	}

	isRunning() { return !!this.interval; }

	tryStart(): void { this.canStart() && this.start(); }

	async start() {
		await new Promise(r => setTimeout(r, 5000));
		this.interval = setInterval(this.loop, 1000 / 60);
	}

	stop(): void {
		if (this.interval)
			clearInterval(this.interval);
		this.interval = undefined;
	}

	private loop = (): void  => {
		this.balls.forEach((ball: Ball, index: number) => {
			ball.move(index);
		});
		this.players.forEach(player => player.move());
	}

	broadcast(data: any): void {
		this.server.to(this.getSocketRoom()).emit('game', data);
	}

	clear(): void {
		this.stop();
		this.players.forEach((player: Player) => {
			player.user.socket?.leave(this.getSocketRoom());
			player.user.player = null;
		})
		this.players = [];
	}
}

@Exclude()
export class Player implements Entity {
	@Expose()
	x: number;
	@Expose()
	y: number;

	@Expose()
	user: User;

	@Expose()
	width: number;
	@Expose()
	height: number;

	@Expose()
	ready: boolean = false;

	@Expose()
	direction: Directions;

	room: Room;
	side: Sides;

	speed: number = 12;
	score: number = 0;

	constructor(user: User, room: Room, side: Sides, width: number, height: number) {
		this.user = user;
		this.room = room;
		this.side = side;
		this.width = width;
		this.height = height;
		this.resetLocation();
	}

	isReady(): boolean { return this.ready }

	setReady(): void {
		if (!this.ready) {
			this.ready = true;
			this.room.broadcast(new PacketPlayOutPlayerReady(instanceToPlain(this)));
		}
	}

	resetLocation(): void {
		this.y = this.room.height / 2 - this.height / 2;

		if (this.side == Sides.LEFT)
			this.x = 0;
		else
			this.x = this.room.width - this.width * 1.3;
	}

	move() {
		if (this.direction === Directions.UP && (this.y - this.speed > 0 - this.height * 0.05))
			this.y -= this.speed;
		else if (this.direction === Directions.DOWN && (this.y + this.speed < this.room.height - this.height))
			this.y += this.speed;
		this.room.broadcast(new PacketPlayOutPlayerMove(instanceToPlain(this)));
	}
}

export class Ball implements Entity {
	x: number;
	y: number;
	direction: [number, number];

	constructor(
		public room: Room,
		public size: number,
		public speed: number,
	) {
		this.resetLocation();
	}

	resetLocation(): void {
		this.x = this.room.width / 2 - this.size / 2;
		this.y = this.room.height / 2 - this.size / 2;
		this.setDirection(0, 0);
	}

	setDirection(x: number, y: number): void {
		if (x == 0 && y == 0) {
			this.direction = [Math.floor(Math.random() * 2) === 0 ? -1 : 1, 0];
		} else {
			let mag = Math.sqrt(x ** 2 + y ** 2);
			this.direction = [x / mag, y / mag];
		}
	}

	handleCollisionTop() {
		if (this.y <= 0) {
			this.direction[1] = Math.abs(this.direction[1]);
		}
	}

	handleCollisionBottom() {
		if (this.y + this.size >= this.room.height){
			this.direction[1] = this.direction[1] * -1;
		}
	}

	handleCollisionLeft() {
		if (this.x + this.direction[0] <= this.room.players[0].x + this.room.players[0].width && this.x + this.direction[0] >= this.room.players[0].x) {
			if (this.y + this.size + this.direction[1] >= this.room.players[0].y && this.y - this.size - this.direction[1] <= this.room.players[0].y + this.room.players[0].height ) {
				if (this.direction[0] < -14)
					this.direction[0] *= -1;
				else
					this.direction[0] = this.direction[0] * -1.1;
				var impact = this.y - this.room.players[0].y - this.room.players[0].height / 2;
				var ratio = 100 / ( this.room.players[0].height / 2);
				this.direction[1] = Math.round(impact * ratio / 10);
			}
		}
	}

	handleCollisionRight() {
		if (this.x + this.direction[0] >= this.room.players[1].x && this.x + this.size + this.direction[0] <= this.room.players[1].x + this.room.players[1].width ) {
			if (this.y + this.size + this.direction[1] >= this.room.players[1].y && this.y - this.size - this.direction[1] <= this.room.players[1].y + this.room.players[1].height ) {
				if (this.direction[0] > 14)
					this.direction[0] *= -1;
				else
					this.direction[0] = this.direction[0]* -1.1;
				var impact = this.y - this.room.players[1].y - this.room.players[1].height / 2;
				var ratio = 100 / ( this.room.players[1].height / 2);
				this.direction[1] = Math.round(impact * ratio / 10);
			}
		}
	}

	move(index: number) {
		if (this.direction[0] < 0) this.handleCollisionLeft();
		else if (this.direction[0] >= 0) this.handleCollisionRight();
		if (this.direction[1] < 0) this.handleCollisionTop();
		else if (this.direction[1] > 0) this.handleCollisionBottom();
		this.x += this.direction[0] * this.speed;
		this.y += this.direction[1] * this.speed;
		if (this.x < 0 - this.room.players[0].width * 2 || this.x > this.room.width + this.room.players[1].width * 2) this.resetLocation();
		this.room.broadcast(new PacketPlayOutBallsMove(index, this.size, this.x, this.y));
	}
}
