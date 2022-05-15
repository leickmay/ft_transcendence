import { Socket } from "socket.io-client";
import { User } from "./User";

interface Entity {
	x: number;
	y: number;
	baseX: number;
	baseY: number;
}

export interface Player extends Entity {
	user: User;
	speed: number;
	up: boolean;
	down: boolean;
	score: number;
}

export interface Spectator {
	user: User;
}

export interface Ball extends Entity {
	skin: string;
	speedX: number;
	speedY: number;
}

export interface Room {
	id: number;
	isFull: boolean;
	p1: Player;
	p2: Player;
	balls: Array<Ball>;
	spectators: Array<Spectator>;
	sockets: Array<Socket>;
}
