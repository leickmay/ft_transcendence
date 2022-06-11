import React, { useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/socket';
import { Ball, GameStatus } from '../../app/interfaces/Game.interface';
import { PacketPlayInGameBallMove } from '../../app/packets/PacketPlayInGameBallMove';
import { PacketPlayInPlayerMove } from '../../app/packets/PacketPlayInPlayerMove';
import { RootState } from '../../app/store';

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

const numberImg: HTMLImageElement = new Image();
numberImg.src = './assets/images/NeonNumber.png';
const numberWidth = 81;
const numberHeight = 100;

let backgroundImg: HTMLImageElement = new Image();
backgroundImg.src = './assets/images/background.png';

let ballImg: HTMLImageElement = new Image();
const ballSize: number = 266;
let ballSx: number = 0;
let sXMultiplier: number = 0;
let ballSy: number = 0; 
let sYMultiplier: number = 0;
ballImg.src = './assets/images/ballSheet.png';

const spriteUrl = '/assets/images/paddles.png';
const spriteWidth: number = 110;
const spriteHeight: number = 450;
let paddleImg: HTMLImageElement = new Image();
paddleImg.src = spriteUrl;

let animationRequest = 0;
let counter = -1;

interface Props {
}

export const GameCanvas = (props: Props) => {
	const game = useSelector((state: RootState) => state.game);

	let canvasRef = useRef<HTMLCanvasElement>(null)
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users);

	useEffect(() => {
		counter > -1 && setTimeout(() => --counter, 1000);
	}, [counter]);

	function animationBall() {
		if (game.balls[0]) {
			if (game.balls[0].dir > 0) {
				sXMultiplier += 1;
				if (sXMultiplier === 12) {
					sXMultiplier = 0;
					sYMultiplier += 1;
					if (sYMultiplier === 10) {
						sYMultiplier = 0;
					}
				}
			}	
			else if (game.balls[0].dir < 0) {
				sXMultiplier -= 1;
				if (sXMultiplier === -1) {
					sXMultiplier = 11;
					sYMultiplier -= 1;
					if (sYMultiplier === -1) {
						sYMultiplier = 9;
					}
				}
			}
			ballSx = ballSize * sXMultiplier;
			ballSy = ballSize * sYMultiplier;
		}
		setTimeout(animationBall, 50);
	}

	const draw = () => {
		if (ctx) {			
			ctx.drawImage(backgroundImg, 0, 0, game.width, game.height);			
			for (const player of game.players) {
				ctx!.drawImage(paddleImg, player.direction * spriteWidth, player.side * spriteHeight, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);
			}
			for (const ball of game.balls) {
				ctx!.drawImage(ballImg, ballSx, ballSy, ballSize, ballSize, ball.x, ball.y, ball.size, ball.size);
			}
			if (counter !== -1 && game.status === GameStatus.FINISHED) {
				let numsx: number = 0;
				let numsy: number = 0;
				switch (counter) {
					case 0:
						numsx = numberWidth * 5;
						numsy = numberHeight;
						break;
					case 1:
						numsx = numberWidth;
						break;
					case 2:
						numsx = numberWidth * 2;
						break;
					case 3:
						numsx = numberWidth * 3;
						break;
					case 4:
						numsx = numberWidth * 4;
						break;
					case 5:
						numsx = 0;
						numsy = numberHeight;
						break;
					case 6:
						numsx = numberWidth;
						numsy = numberHeight;
						break;
					case 7:
						numsx = numberWidth * 2;
						numsy = numberHeight;
						break;
					case 8:
						numsx = numberWidth * 3;
						numsy = numberHeight;
						break;
					case 9:
						numsx = numberWidth * 4;
						numsy = game.balls[0].dir > 0 ? 0 : numberHeight;
						break;
					default:
						break;
				}
				ctx.drawImage(numberImg, numsx, numsy, numberWidth, numberHeight, game.width / 2 - numberWidth, game.height / 2 - numberHeight, numberWidth * 2, numberHeight * 2);
			}
		}
	}

	useEffect(() => {
		const start = (canvas: HTMLCanvasElement | null) => {
			if (!canvas)
				return ;
			counter = 5;
			canvas.style.animationName = 'appearCvs';
			ctx = canvas.getContext('2d');
			animationRequest = requestAnimationFrame(loop);
		}

		const loop = () => {
			draw();
			animationRequest = requestAnimationFrame(loop);
		}

		start(canvasRef.current);
		return (() => {
			cancelAnimationFrame(animationRequest);
		});
	}, []);

	const handlePlayerMove = (packet: PacketPlayInPlayerMove) => {
		game.players.forEach(p => p.user.id === packet.player && (p.direction = packet.direction));
	}

	const handleBallsMove = (packet: PacketPlayInGameBallMove) => {
		if(game.balls.length < packet.id + 1) {
			game.balls.push({size: packet.size, x: packet.x, y: packet.y} as Ball)
		} else {
			game.balls[packet.id].size = packet.size;
			game.balls[packet.id].x = packet.x;
			game.balls[packet.id].y = packet.y;
			game.balls[packet.id].dir = packet.dir;
		}
	}

	return (
		<canvas className="canvas" ref={canvasRef} height={game.height} width={game.width}></canvas>
	);
};
