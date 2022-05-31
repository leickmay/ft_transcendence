import { User } from "./User";

export enum Directions {
	UP,
	DOWN,
	STATIC,
}

interface Entity {
	x: number;
	y: number;
}

export interface Player extends Entity {
	user: User;
	isReady: boolean;
	speed: number;
	direction: Directions;
	height: number;
	width: number;
	score: number;
}

export interface CreatePlayerDto {
	user: User;
	x: number;
	y: number;
	width: number;
	height: number;
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
	raf: NodeJS.Timer;
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
}
