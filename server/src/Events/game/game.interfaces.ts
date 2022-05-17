import { Socket } from "socket.io";
import { User } from "../../user/user.entity";

export enum GameEvents {
	JOIN,
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

interface IEntity {
	x: number;
	y: number;
	baseX: number;
	baseY: number;
}

export interface IPlayer extends IEntity {
	user: User;
	socket: Socket;
	speed: number;
	up: boolean;
	down: boolean;
	score: number;
	height: number;
	width: number;
}

export interface ISpectator {
	user: User;
}

export interface IBall extends IEntity {
	skin: string;
	speedX: number;
	speedY: number;
}

interface IRoom {
	id: number;
	height: number;
	width: number;
	isFull: boolean;
	p1: IPlayer;
	p2: IPlayer;
	balls: Array<IBall>;
	spectators: Array<ISpectator>;
}

export class Room implements IRoom {
	id = -1;
	height = 1080;
	width = 1920;
	isFull = false;

	p1 = {
		user: null,
		socket: -1,
		speed : 12,
		up : false,
		down : false,
		score : 0,
		height : this.height / 8,
		width : this.width / 100,
		baseX : this.width / 100,
		baseY : this.height / 2 - ((this.height / 8) / 2),
		x : this.width / 100,
		y : this.height / 2 - ((this.height / 8) / 2)
	};

	p2 = {
		user: null,
		socket: -1,
		speed : 12,
		up : false,
		down : false,
		score : 0,
		height : this.height / 8,
		width : this.width / 100,
		baseX : this.width / 100,
		baseY : this.height / 2 - ((this.height / 8) / 2),
		x : this.width / 100,
		y : this.height / 2 - ((this.height / 8) / 2)
	};

	balls = null;

	spectators = null;

}