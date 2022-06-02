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
	ready: boolean;
	speed: number;
	direction: Directions;
	height: number;
	width: number;
	score: number;
}

export interface Spectator {
	user: User;
}

export interface Ball extends Entity {
	size: number;
}

export interface Room {
	id: number;
	raf: NodeJS.Timer | undefined;
	height: number;
	width: number;
	isPriv: boolean;
	isFull: boolean;
	isStart: boolean;
	isOver: boolean;
	p1: Player | undefined;
	p2: Player | undefined;
	balls: Array<Ball>;
	spectators: Array<Spectator>;
}
