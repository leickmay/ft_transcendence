import { Socket } from "socket.io";
import { User } from "../../user/user.entity";

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

interface IEntity {
	x: number;
	y: number;
	baseX: number;
	baseY: number;
}

export interface IPlayer extends IEntity {
	user: User;
	socket: Socket;
	isReady: boolean;
	speed: number;
	up: boolean;
	down: boolean;
	score: number;
	paddleSrc: string;
	height: number;
	width: number;
}

export interface ISpectator {
	user: User;
}

export interface IBall extends IEntity {
	ballSrc: string;
	size: number;
	speedX: number;
	speedY: number;
}

interface IRoom {
	id: number;
	height: number;
	width: number;
	isPriv: boolean;
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
	isPriv = false;
	isFull = false;
	isStart= false;
	isOver = false;

	p1 = {
		user: null,
		socket: null,
		isReady: false,
		speed : 12,
		up : false,
		down : false,
		score : 0,
		paddleSrc: './assets/images/paddle1.png',
		height : this.height / 4,
		width : this.width / 40,
		baseX : this.width / 200,
		baseY : this.height / 2 - ((this.height / 4) / 2),
		x : this.width / 200,
		y : this.height / 2 - ((this.height / 4) / 2),
	};

	p2 = {
		user: null,
		socket: null,
		isReady: false,
		speed : 12,
		up : false,
		down : false,
		score : 0,
		paddleSrc: './assets/images/paddle2.png',
		height : this.height / 4,
		width : this.width / 40,
		baseX : this.width / 1.03,
		baseY : this.height / 2 - ((this.height / 4) / 2),
		x : this.width / 1.03,
		y : this.height / 2 - ((this.height / 4) / 2),
	};

	balls = [{
		ballSrc: './assets/images/ball.png',
		size: this.height / 10,
		speedX: 0,
		speedY: 0,
		baseX: this.width / 2 - ((this.height / 10) / 2),
		baseY: this.height / 2 - ((this.height / 10) / 2),
		x: this.width / 2 - ((this.height / 10) / 2),
		y: this.height / 2 - ((this.height / 10) / 2),
	}];

	spectators = new Array;
	sockets = new Map;
}