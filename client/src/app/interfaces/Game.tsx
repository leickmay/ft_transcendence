export interface GameRoom {
	player1: string;
	p1Avatar: string;
	p1Up: boolean;
	p1Down: boolean;
	p1BasePos: number;
	p1Pos: number;
	player2: string;
	p2Avatar: string;
	p2Up: boolean;
	p2Down: boolean;
	p2BasePos: number;
	p2Pos: number;
	BallY: number;
	isFull: boolean;
	usrsSocket: Map<any, any>;
}
