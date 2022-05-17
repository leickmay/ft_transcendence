import { Socket } from "socket.io";
import { User } from "../../user/user.entity";

interface EntityI {
	x: number;
	y: number;
	baseX: number;
	baseY: number;
}

interface PlayerI extends EntityI {
	user: User;
	speed: number;
	up: boolean;
	down: boolean;
	score: number;
	height: number;
	width: number;
}

interface SpectatorI {
	user: User;
}

interface BallI extends EntityI {
	skin: string;
	speedX: number;
	speedY: number;
}

interface RoomI {
	id: number;
	height: number;
	width: number;
	isFull: boolean;
	p1: PlayerI;
	p2: PlayerI;
	balls: Array<BallI>;
	spectators: Array<SpectatorI>;
	sockets: Map<any, any>;
}

export class Room implements RoomI {
	id = -1;
	height = 1080;
	width = 1920;
	isFull = false;

	p1 = {
		user: null,
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
		user: User : null,
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

	balls = [{
		baseX: 
	}];

}