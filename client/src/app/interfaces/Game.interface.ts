import { User } from "./User";

export enum Directions {
	STATIC,
	UP,
	DOWN,
}

export enum Sides {
	LEFT,
	RIGHT,
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
	side: Sides;

	// Local only
	// screenX?: number;
	screenY: number;
}

export interface Spectator {
	user: User;
}

export interface Ball extends Entity {
	id: number,
	radius: number;
	speed: number;
	direction: { x: number, y: number };

	// Local only
	screenX: number;
	screenY: number;
}

export enum GameStatus {
	NONE,
	MATCHMAKING,
	WAITING,
	STARTING,
	RUNNING,
	FINISHED,
}
