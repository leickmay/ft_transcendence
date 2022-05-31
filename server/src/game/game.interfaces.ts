import { Server } from "socket.io";
import { PacketPlayOutPlayerJoin } from "src/socket/packets/PacketPlayOutPlayerJoin";
import { PacketPlayOutPlayerList } from "src/socket/packets/PacketPlayOutPlayerList";
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

export class Player implements Entity {
	x: number;
	y: number;

	direction: Directions;

	private ready: boolean = false;

	speed: number = 12;
	score: number = 0;

	constructor(
		public readonly user: User,
		public room: Room,
		public side: Sides,
		public width: number,
		public height: number,
	) {
		this.resetLocation();
	}

	isReady(): boolean { return this.ready }

	setReady(): void {
		if (!this.ready) {
			this.ready = true;
			this.room.broadcast(new PacketPlayOutPlayerReady(this.user.id));
		}
	}

	resetLocation(): void {
		this.y = this.room.height / 2 - this.height / 2;

		if (this.side == Sides.LEFT)
			this.x = 0;
		else
			this.x = this.room.width - this.width;
	}

	move() {
		if (this.direction === Directions.UP)
			this.y -= this.speed;
		else if (this.direction === Directions.DOWN)
			this.y += this.speed;
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
			this.direction = [0, 0];
		} else {
			let mag = Math.sqrt(x ** 2 + y ** 2);
			this.direction = [x / mag, y / mag];
		}
	}

	willCollideVertical(): boolean {
		let nextY = this.y + (this.direction[0] * this.speed);
		return nextY < 0 || nextY > this.room.height;
	}

	move() {
		this.x += this.direction[0] * this.speed;
		this.y += this.direction[1] * this.speed;
	}
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

	private players: Array<Player>;
	private balls: Array<Ball>;
	spectators: Array<Spectator>;

	maxScore: number = 5;

	constructor(private readonly server: Server) {
		this.id = ++Room.current;
	}

	private chooseSide(): Sides {
		return this.players.filter(p => p.side === Sides.LEFT).length > this.players.length / 2 ? Sides.RIGHT : Sides.LEFT;
	}

	canStart(): boolean { return this.players.length >= this.minPlayers; }
	isFull(): boolean { return this.players.length >= this.maxPlayers; }

	join(user: User): void {
		if (!this.isFull()) {
			user.send('game', new PacketPlayOutPlayerList(this.players)); // TODO classtransformer

			let player = new Player(user, this, this.chooseSide(), this.height / 4, this.width / 40);

			user.player = player;
			this.players.push(player);

			user.socket?.join(this.id.toString());
			this.broadcast(new PacketPlayOutPlayerJoin(user.player)); // TODO classtransformer
		}
	}

	isRunning() { return !!this.interval; }

	tryStart(): void { this.canStart() && this.start(); }

	start(): void {
		this.interval = setInterval(this.loop, 1000 / 60);
	}

	stop(): void {
		if (this.interval)
			clearInterval(this.interval);
		this.interval = undefined;
	}

	private loop(): void {
		this.balls.forEach(ball => {
			if (ball.willCollideVertical())
				ball.y *= -1;
			ball.move();
		});
		this.players.forEach(player => player.move());
	}

	broadcast(data: any): void {
		this.server.to(this.id.toString()).emit('game', data);
	}

	clear(): void {
		stop();
		this.players.forEach(player => {
			player.user.socket?.leave(this.id.toString());
			player.user.player = null;
		})
		this.players = [];
	}
}
