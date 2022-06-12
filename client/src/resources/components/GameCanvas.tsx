import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/socket';
import { useAnimationFrame } from '../../app/Helpers';
import { Player } from '../../app/interfaces/Game.interface';
import { RootState } from '../../app/store';

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

let intervalId = 0;
let counter = -1;

interface Props {
}

export const GameCanvas = (props: Props) => {
	const game = useSelector((state: RootState) => state.game);
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const players = useRef<Array<Player>>([]);

	let canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
		if (canvas !== null)
			setCtx(canvas.getContext('2d'));
	}, []);

	useEffect(() => {
		players.current = game.players.map(p => ({...p}));
	}, [game.players]);

	useAnimationFrame((delta) => {
		if (ctx) {
			ctx.drawImage(backgroundImg, 0, 0, game.width, game.height);
			for (const player of players.current)
				ctx.drawImage(paddleImg, player.direction * spriteWidth, player.side * spriteHeight, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);
			for (const ball of game.balls)
				ctx.drawImage(ballImg, ballSx, ballSy, ballSize, ballSize, ball.x, ball.y, ball.size, ball.size);
		}
	}, [ctx]);

	useEffect(() => {
		const loop = () => {
			players.current.forEach(p => p.y--);
			// dispatch(gameLoopReducer());
		}

		intervalId = window.setInterval(loop, game.refreshTime);
		return (() => {
			clearInterval(intervalId);
		});
	}, []);

	return (
		<canvas className='border-neon-primary' ref={canvasRef} height={game.height} width={game.width}></canvas>
	);
};
