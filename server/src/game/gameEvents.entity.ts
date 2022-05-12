import { Socket } from "socket.io";
import { User } from "../user/user.entity";

class Entity {
	x: number;
	y: number;
	baseX: number;
	baseY: number;
	speed: number;
}

export class Player extends Entity {
	user: User;
	up: boolean;
	down: boolean;
	score: number;
}

export class Spectator {
	user: User;
}

export class Ball extends Entity {
	skin: string;
}

export class Room {
	id: number;
	isFull: boolean;
	p1: Player;
	p2: Player;
	balls: Array<Ball>;
	spectators: Array<Spectator>;
	sockets: Map<any, any>;
}