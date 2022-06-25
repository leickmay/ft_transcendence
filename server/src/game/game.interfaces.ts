import { Exclude, Expose, instanceToPlain } from "class-transformer";
import { Server } from "socket.io";
import { PacketPlayOutBallUpdate } from "src/socket/packets/PacketPlayOutBallUpdate";
import { PacketPlayOutGameDestroy } from "src/socket/packets/PacketPlayOutGameDestroy";
import { PacketPlayOutGameUpdate } from "src/socket/packets/PacketPlayOutGameUpdate";
import { PacketPlayOutPlayerJoin } from "src/socket/packets/PacketPlayOutPlayerJoin";
import { PacketPlayOutPlayerList } from "src/socket/packets/PacketPlayOutPlayerList";
import { PacketPlayOutPlayerReady } from "src/socket/packets/PacketPlayOutPlayerReady";
import { PacketPlayOutPlayerTeleport } from "src/socket/packets/PacketPlayOutPlayerTeleport";
import { PacketPlayOutPlayerUpdate } from "src/socket/packets/PacketPlayOutPlayerUpdate";
import { PacketPlayOutUserConnection } from "src/socket/packets/PacketPlayOutUserConnection";
import { StatsService } from "src/stats/stats.service";
import { clearInterval } from "timers";
import { User } from "../user/user.entity";

export class Vector2 {
	x: number;
	y: number;

	constructor();
	constructor(x: number, y: number);
	constructor(point: { x: number, y: number });
	constructor(x?: number | { x: number, y: number }, y?: number) {
		if (typeof x === 'object') {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x || 0;
			this.y = y || 0;
		}
	}
	
	equals(other: Vector2): boolean {
		return this.x === other.x && this.y === other.y;
	}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	mul(n: number): Vector2;
	mul(other: Vector2): Vector2;
	mul(other: Vector2 | number): Vector2 {
		if (typeof other === 'number') {
			this.x *= other;
			this.y *= other;
		} else {
			this.x += other.x;
			this.y += other.y;
		}
		return this;
	}

	add(other: Vector2): Vector2 {
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	sub(other: Vector2): Vector2 {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

	distance(other: Vector2): number {
		return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
	}
}

export interface Entity {
	location: Vector2;

	resetLocation(): void;
}

export enum Sides {
	LEFT,
	RIGHT,
}

export enum Directions {
	STATIC,
	UP,
	DOWN,
}

export interface Spectator {
	user: User;
}

export enum GameStatus {
	NONE,
	MATCHMAKING,
	WAITING,
	STARTING,
	RUNNING,
	FINISHED,
}

@Exclude()
export class Room {
	private static current = 0;

	private gameInterval?: NodeJS.Timer;
	private tick = 0;

	@Expose()
	readonly tps = 20;
	@Expose()
	readonly height: number = 1080;
	@Expose()
	readonly width: number = 1920;
	@Expose()
	readonly minPlayers = 2;
	@Expose()
	readonly maxPlayers = 2;
	@Expose()
	readonly startTime = 5;

	@Expose()
	id: number;
	@Expose()
	status: GameStatus = GameStatus.WAITING;

	private currentBallId = 0;
	players: Array<Player> = [];
	balls: Array<Ball> = [];
	spectators: Array<Spectator> = [];

	@Expose()
	maxScore: number = /* 5 */ 500; // TODO change

	get nextBallId() {
		return ++this.currentBallId;
	}

	constructor(
		private readonly server: Server,
		private readonly statsService: StatsService,
	) {
		this.id = ++Room.current;
	}

	private countLeftTeam(): number {
		return this.players.filter(p => p.side === Sides.LEFT).length;
	}

	private chooseSide(): Sides {
		return this.players.filter(p => p.side === Sides.LEFT).length > this.players.length / 2 ? Sides.RIGHT : Sides.LEFT;
	}

	private getSocketRoom(): string {
		return 'game_' + this.id.toString();
	}

	canStart(): boolean { return this.status === GameStatus.WAITING && this.players.every(p => p.ready); }
	isFull(): boolean { return this.players.length >= this.maxPlayers; }

	join(user: User): void {
		if (!this.isFull()) {
			user.send('game', new PacketPlayOutGameUpdate(instanceToPlain(this)));
			user.send('game', new PacketPlayOutPlayerList(instanceToPlain(this.players)));

			let player = new Player(user, this, this.chooseSide(), 110 * 0.75, 450 * 0.75);

			user.player = player;
			this.players.push(player);

			user.socket?.join(this.getSocketRoom());
			this.broadcast(new PacketPlayOutPlayerJoin(instanceToPlain(user.player)));
			this.server.emit('user', new PacketPlayOutUserConnection([{ id: user.id, login: user.login, playing: true }]));
		}
	}

	spectate(user: User): void {
		user.send('game', new PacketPlayOutGameUpdate(instanceToPlain(this)));
		user.send('game', new PacketPlayOutPlayerList(instanceToPlain(this.players)));

		this.spectators.push({user: user});

		user.socket?.join(this.getSocketRoom());
	}

	private remove(player: Player): User | undefined {
		let index = this.players.indexOf(player);
		if (index > -1) {
			this.players.splice(index, 1);
			this.server.emit('user', new PacketPlayOutUserConnection([{ id: player.user.id, login: player.user.login, playing: false }]));
			player.user.socket?.leave(this.getSocketRoom());
			player.user.player = null;
			return player.user;
		}
		return undefined;
	}

	leave(player: Player): void {
		let user = this.remove(player);

		if (user) {
			let left = this.countLeftTeam();
			if (left === 0 || left === this.players.length) {
				this.clear();
			}
		}
	}

	end(winner: Player | undefined) {
		this.status = GameStatus.FINISHED;
		this.broadcast(new PacketPlayOutGameUpdate({
			status: GameStatus.FINISHED,
		}));
		clearInterval(this.gameInterval);
		this.gameInterval = undefined;
		if (winner) {
			if (this.players.length === 2) {
				this.statsService.addStat(this.players[0].user, this.players[1].user, winner.user.id);
			}
			for (const player of this.players) {
				player.user.xp += player.side === winner.side ? 20 : 5;
				player.user.xp += player.score;
				player.user.save();
			}
		}
	}

	tryStart(): void { this.canStart() && this.start(); }

	async start() {
		this.status = GameStatus.STARTING;
		this.broadcast(new PacketPlayOutGameUpdate({
			status: GameStatus.STARTING,
		}));
		setTimeout(() => {
			this.status = GameStatus.RUNNING;
			this.broadcast(new PacketPlayOutGameUpdate({
				status: GameStatus.RUNNING,
			}));

			let b = new Ball(this, 30, 30, 60);
			b.setDirection(1, 1);
			this.balls.push(b);

			this.gameInterval = setInterval(this.loop, 1000 / this.tps);
			// this.balls.push(new Ball(this.balls.length, this, 75, 8));
		}, 5000);
	}

	private loop = (): void => {		
		for (const player of this.players) {
			player.move();
			player.sendUpdate();
		}
		for (const ball of this.balls) {
			this.checkPlayerCollisions(ball);
			if (ball.location.x < -ball.radius || ball.location.x > this.width + ball.radius) {
				let side = ball.location.x < -ball.radius ? Sides.LEFT : Sides.RIGHT;
				for (const player of this.players) {
					if (player.side !== side) {
						++player.score;
						this.broadcast(new PacketPlayOutPlayerUpdate({id: player.user.id, score: player.score}));
					}
				}
				this.players.forEach(p => {
					p.resetLocation();
					p.sendUpdate();
				});
				ball.resetLocation();
			} else {
				ball.move();
			}
			ball.sendUpdate();
		}
		let winner: Player | undefined = this.players.find(p => p.score >= this.maxScore);
		if (winner) {
			this.end(winner);
		}
		++this.tick;
	}

	getCollision(ball: Ball, player: Player) {
		var distX = Math.abs(ball.location.x - player.location.x - player.width / 2);
		var distY = Math.abs(ball.location.y - player.location.y - player.height / 2);

		if (distX > (player.width / 2 + ball.radius)) { return false; }
		if (distY > (player.height / 2 + ball.radius)) { return false; }

		if (distX <= (player.width / 2)) { return true; }
		if (distY <= (player.height / 2)) { return true; }

		var dx = distX - player.width / 2;
		var dy = distY - player.height / 2;
		return (dx * dx + dy * dy <= (ball.radius * ball.radius));
	}

	checkPlayerCollisions(ball: Ball) {
		if (ball.willCollideVertical())
			ball.setDirection(ball.direction.x, -ball.direction.y);

		for (const player of this.players) {
			if (this.getCollision(ball, player)) {
				if (player.side === Sides.LEFT)
					ball.setDirection(Math.abs(ball.direction.x), ball.direction.y);
				else
					ball.setDirection(-Math.abs(ball.direction.x), ball.direction.y);
				ball.speed = Math.min(ball.speed + 0.5, ball.maxSpeed);
				ball.sendUpdate();
			}
		}
	}

	stop(): void {
		clearInterval(this.gameInterval);
		this.gameInterval = undefined;
	}

	broadcast(data: any): void {
		this.server.to(this.getSocketRoom()).emit('game', data);
	}

	clear(): void {
		this.stop();
		this.broadcast(new PacketPlayOutGameDestroy());
		for (const player of this.players) {
			this.remove(player);
		}
		this.players = [];
	}
}

@Exclude()
export class Player implements Entity {
	@Expose()
	location: Vector2;

	@Expose()
	user: User;

	@Expose()
	width: number;
	@Expose()
	height: number;

	@Expose()
	speed: number = 40;
	@Expose()
	score: number = 0

	@Expose()
	ready: boolean = false;

	@Expose()
	direction: Directions = Directions.STATIC;

	@Expose()
	side: Sides;

	room: Room;

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
			this.room.broadcast(new PacketPlayOutPlayerReady(this.user.id));
		}
	}

	resetLocation(): void {
		this.location = new Vector2(this.side == Sides.LEFT ? 0 : this.room.width - this.width, this.room.height / 2 - this.height / 2);
	}

	move() {
		if (this.direction === Directions.UP)
			this.location.y -= this.speed;
		else if (this.direction === Directions.DOWN)
			this.location.y += this.speed;
		this.location.y = Math.max(Math.min(this.location.y, this.room.height - this.height), 0);
	}

	sendUpdate() {
		this.room.broadcast(new PacketPlayOutPlayerTeleport(this.user.id, this.location, this.direction));
	}

	leave() {
		this.room.leave(this);
	}
}

export class Ball implements Entity {
	id: number;
	room: Room;
	radius: number;
	speed: number;
	location: Vector2;
	direction: Vector2;

	maxSpeed: number;

	constructor(room: Room, radius: number, speed: number, maxSpeed: number) {
		this.id = room.nextBallId;
		this.room = room;
		this.radius = radius;
		this.speed = speed;
		this.maxSpeed = maxSpeed;
		this.resetLocation();
		this.sendUpdate();
	}

	sendUpdate() {
		this.room.broadcast(new PacketPlayOutBallUpdate(this.id, this.location, this.direction, this.radius, this.speed));
	}

	resetLocation(): void {
		this.location = new Vector2(this.room.width / 2 - this.radius / 2, this.room.height / 2 - this.radius / 2);
		this.setDirection(0, 0);
	}

	setDirection(x: number, y: number): void {
		if (x == 0 && y == 0) {
			this.direction = new Vector2(Math.floor(Math.random() * 2) === 0 ? -1 : 1, 1);
		} else {
			let mag = Math.sqrt(x ** 2 + y ** 2);
			this.direction = new Vector2(x / mag, y / mag);
		}
	}

	willCollideVertical(): boolean {
		let nextY = this.location.y + (this.direction.y * this.speed);
		return nextY < 0 || nextY > this.room.height;
	}

	move() {
		this.location.add(this.direction.clone().mul(this.speed));
	}
}
