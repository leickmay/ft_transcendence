import { User } from "./User";

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
			return new Vector2(this.x * other, this.y * other);
		}
		return new Vector2(this.x * other.x, this.y * other.y);
	}

	add(other: Vector2): Vector2 {
		return new Vector2(this.x + other.x, this.y + other.y);
	}

	sub(other: Vector2): Vector2 {
		return new Vector2(this.x - other.x, this.y - other.y);
	}

	distance(other: Vector2): number {
		return Math.abs(Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2));
	}

	interpolate(other: Vector2, frac: number): Vector2 {
		return this.add(other.sub(this).mul(frac));
	}
}

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
	location: Vector2;
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
	direction: Vector2;

	// Local only
	screen: {
		location: Vector2;
		direction: Vector2;
	}
}

export enum GameStatus {
	NONE,
	MATCHMAKING,
	WAITING,
	STARTING,
	RUNNING,
	FINISHED,
}
