import { createContext } from "react";
import { User } from "./User";

export enum Directions {
	STATIC,
	UP,
	DOWN,
}

export enum Sides {
	RIGHT,
	LEFT,
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
}

export interface Spectator {
	user: User;
}

export interface Ball extends Entity {
	size: number;
	dir: number;
}

export interface GameData {
	id: number;
	height: number;
	width: number;
	full: boolean;
	started: boolean;
	over: boolean;
	minPlayers: number;
	maxPlayers: number;
	players: Array<Player>;
	balls: Array<Ball>;
	// spectators: Array<Spectator>;
}
