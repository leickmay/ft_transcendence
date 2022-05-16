import { Socket } from "socket.io";
import { User } from "../user/user.entity";

class Entity {
	x: number;
	y: number;
	baseX: number;
	baseY: number;
}

export class Player extends Entity {
	user: User;
	speed: number;
	up: boolean;
	down: boolean;
	score: number;
	height: number;
	width: number;
}

export class Spectator {
	user: User;
}

export class Ball extends Entity {
	skin: string;
	speedX: number;
	speedY: number;
}

export class Room {
	id: number;
	height: number;
	width: number;
	isFull: boolean;
	p1: Player;
	p2: Player;
	balls: Array<Ball>;
	spectators: Array<Spectator>;
	sockets: Map<any, any>;
}