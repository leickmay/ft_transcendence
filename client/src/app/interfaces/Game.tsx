import { Socket } from "socket.io-client";
import { User } from "./User";

interface Entity {
	x: number;
	y: number;
	baseX: number;
	baseY: number;
	speed: number;
}

export interface Player extends Entity {
	user: User;
	up: boolean;
	down: boolean;
	score: number;
}

export interface Spectator {
	user: User;
}

export interface Ball extends Entity {
	skin: string;
}

export interface Room {
	id: number;
	isFull: boolean;
	p1: Player;
	p2: Player;
	nalls: Array<Ball>;
	spectators: Array<Spectator>;
	sockets: Array<Socket>;
}
