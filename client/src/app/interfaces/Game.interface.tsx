import { Socket } from "socket.io-client";
import { User } from "./User";

export enum GameEvents {
	JOINRAND,
	CREATEPRIV,
	JOINPRIV,
	START,
	OVER,
	CLEAR,
	MOVE,
}

export enum Directions {
	UP,
	DOWN,
	STATIC,
}

export interface GamePacket {
	id: number;
	user: User;
	roomId: number;
	isPriv: boolean;
	direction: Directions;
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
	paddleSrc: string;
	height: number;
	width: number;
}

export interface Spectator {
	user: User;
}

export interface Ball extends Entity {
	ballSrc: string;
	size: number;
	speedX: number;
	speedY: number;
}

export interface Room {
	id: number;
	height: number;
	width: number;
	isPriv: boolean;
	isFull: boolean;
	isStart: boolean;
	isOver: boolean;
	p1: Player;
	p2: Player;
	balls: Array<Ball>;
	spectators: Array<Spectator>;
	sockets: Map<any, any>;
}
