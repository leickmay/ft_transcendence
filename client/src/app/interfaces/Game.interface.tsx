import { Socket } from "socket.io-client";
import { User } from "./User";

export enum GameEvents {
	JOIN,
	START,
	OVER,
	CLEAR,
	MOVE,
}

export enum Directions {
	UP,
	DOWN,
}

export interface GamePacket {
	id: number;
	user: User;
	roomId: number;
	direction: Directions,
}

interface Entity {
	x: number;
	y: number;
	baseX: number;
	baseY: number;
}

export interface Player extends Entity {
	user: User;
	isReady: boolean;
	speed: number;
	up: boolean;
	down: boolean;
	score: number;
	height: number;
	width: number;
}

export interface Spectator {
	user: User;
}

export interface Ball extends Entity {
	skin: string;
	size: number;
	speedX: number;
	speedY: number;
}

export interface Room {
	id: number;
	height: number;
	width: number;
	isFull: boolean;
	isStart: boolean;
	isOver: boolean;
	p1: Player;
	p2: Player;
	balls: Array<Ball>;
	spectators: Array<Spectator>;
	sockets: Map<any, any>;
}
