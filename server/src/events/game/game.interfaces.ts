import { Socket } from "socket.io";
import { User } from "../../user/user.entity";

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

interface IEntity {
	x: number;
	y: number;
	baseX: number;
	baseY: number;
}

export interface IPlayer extends IEntity {
	user: User;
	isReady: boolean;
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
	size: number;
	speedX: number;
	speedY: number;
}

interface IRoom {
	id: number;
	height: number;
	width: number;
	isFull: boolean;
	isStart: boolean;
	isOver: boolean;
	p1: IPlayer;
	p2: IPlayer;
	balls: Array<IBall>;
	spectators: Array<ISpectator>;
	sockets: Map<any, any>;
}

export class Room implements IRoom {
	id = -1;
	height = 1080;
	width = 1920;
	isFull = false;
	isStart= false;
	isOver = false;

	p1 = {
		user: null,
		isReady: false,
		socket: null,
		speed : 12,
		up : false,
		down : false,
		score : 0,
		height : this.height / 6,
		width : this.width / 80,
		baseX : this.width / 100,
		baseY : this.height / 2 - ((this.height / 8) / 2),
		x : this.width / 100,
		y : this.height / 2 - ((this.height / 8) / 2),
	};

	p2 = {
		user: null,
		isReady: false,
		socket: null,
		speed : 12,
		up : false,
		down : false,
		score : 0,
		height : this.height / 6,
		width : this.width / 80,
		baseX : this.width / 1.02,
		baseY : this.height / 2 - ((this.height / 8) / 2),
		x : this.width / 1.02,
		y : this.height / 2 - ((this.height / 8) / 2),
	};

	balls = [{
		skin: null,
		size: this.height / 100,
		speedX: 6,
		speedY: 6,
		baseX: this.width / 2,
		baseY: this.width / 2,
		x: this.width / 2,
		y: this.width / 2,
	}];

	spectators = new Array;
	sockets = new Map;
}