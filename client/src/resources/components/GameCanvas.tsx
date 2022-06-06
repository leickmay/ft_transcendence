import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/socket';
import { Ball, GameData } from '../../app/interfaces/Game.interface';
import { PacketPlayInGameBallMove } from '../../app/packets/PacketPlayInGameBallMove';
import { PacketPlayInPlayerMove } from '../../app/packets/PacketPlayInPlayerMove';
import { PacketPlayInPlayerReady } from '../../app/packets/PacketPlayInPlayerReady';
import { Packet, PacketTypesGame, PacketTypesPlayer } from '../../app/packets/packetTypes';
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

let counter = 0;

interface Props {
	game: GameData;
}

export const GameCanvas = (props: Props) => {
	
	const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

	let canvasRef = useRef<HTMLCanvasElement>(null)
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);
	
	const [waitForPlay, setWaitForPlay] = useState<boolean>(false);
	const [showGameResult, setShowGameResult] = useState<boolean>(true);
	
	useEffect(() => {
		counter > -1 && setTimeout(() => --counter, 1000);
		if (counter === 3 && props.game?.over) {
			setShowGameResult(false);
		}
	}, [counter]);

	function animationBall() {
		if (props.game && props.game.balls[0]) {
			if (props.game.balls[0].dir > 0) {
				sXMultiplier += 1;
				if (sXMultiplier === 12) {
					sXMultiplier = 0;
					sYMultiplier += 1;
					if (sYMultiplier === 10) {
						sYMultiplier = 0;
					}
				}
			}	
			else if (props.game.balls[0].dir < 0) {
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

	async function start(canvas: HTMLCanvasElement) {
		canvas = canvas;
		if (!canvas)
			return ;
		counter = 5;
		props.game.started = true;
		canvas!.style.animationName = 'appearCvs';
		ctx = canvas!.getContext('2d');
		requestAnimationFrame(draw);
	}

	const draw = () => {
		if (ctx) {
			ctx.drawImage(backgroundImg, 0, 0, props.game.width, props.game.height);
			props.game.players.forEach(p => {
				ctx!.drawImage(paddleImg, p.direction * spriteWidth, p.side * spriteHeight, spriteWidth, spriteHeight, p.x, p.y, p.width, p.height);
			});
			props.game.balls.forEach((ball: Ball) => {
				ctx!.drawImage(ballImg, ballSx, ballSy, ballSize, ballSize, ball.x, ball.y, ball.size, ball.size);
			})
			if (counter !== -1 && props.game.started && !props.game.over) {
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
						numsy = props.game.balls[0].dir > 0 ? 0 : numberHeight;
						break;
					default:
						break;
				}
				ctx.drawImage(numberImg, numsx, numsy, numberWidth, numberHeight, props.game.width / 2 - numberWidth, props.game.height / 2 - numberHeight, numberWidth * 2, numberHeight * 2);
			}
		}
		requestAnimationFrame(draw);
	}

	const handleReady = (packet: PacketPlayInPlayerReady) => {
		props.game.players.forEach(p => p.user.id === packet.player && (p.ready = true));
		if (!props.game.players.find(p => !p.ready) && canvasRef.current) {
			forceUpdate();
			start(canvasRef.current);
			//setInterval(animationBall, 100);
			setTimeout(animationBall, 50);
		}
	}

	const handlePlayerMove = (packet: PacketPlayInPlayerMove) => {
		props.game.players.forEach(p => p.user.id === packet.player && (p.direction = packet.direction));
	}

	const handleBallsMove = (packet: PacketPlayInGameBallMove) => {
		if(props.game.balls.length < packet.id + 1) {
			props.game.balls.push({size: packet.size, x: packet.x, y: packet.y} as Ball)
		} else {
			props.game.balls[packet.id].size = packet.size;
			props.game.balls[packet.id].x = packet.x;
			props.game.balls[packet.id].y = packet.y;
			props.game.balls[packet.id].dir = packet.dir;
		}
	}

	socket?.off('game').on('game', (packet: Packet): void => {
		switch (packet.packet_id) {
			case PacketTypesPlayer.READY:
				handleReady(packet as PacketPlayInPlayerReady);
				break;
			case PacketTypesPlayer.MOVE:
				handlePlayerMove(packet as PacketPlayInPlayerMove);
				break;
			case PacketTypesGame.BALL_MOVE:
				handleBallsMove(packet as PacketPlayInGameBallMove);
				break;
			default:
				break;
		}
	});

	return (
		<canvas className="canvas" ref={canvasRef} height={props.game.height} width={props.game.width}></canvas>
	);
};
