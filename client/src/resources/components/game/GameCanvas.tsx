import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameContext } from '../../../app/context/GameContext';
import { useAnimationFrame } from '../../../app/Helpers';
import { Directions } from '../../../app/interfaces/Game.interface';
import { RootState } from '../../../app/store';
import backgroundUrl from '../../../assets/images/game-background.png';
import ballUrl from '../../../assets/images/ball.png';
import paddleUrl from '../../../assets/images/paddles.png';

const spriteWidth: number = 110;
const spriteHeight: number = 450;

const backgroundImg = new Image(); backgroundImg.src = backgroundUrl;
const ballImg = new Image(); ballImg.src = ballUrl;
const paddleImg = new Image(); paddleImg.src = paddleUrl;

const interpolate = (a: { x: number, y: number }, b: { x: number, y: number }, frac: number): { x: number, y: number } => {
	var nx = a.x + (b.x - a.x) * frac;
	var ny = a.y + (b.y - a.y) * frac;
	return { x: nx, y: ny };
}

interface Props {
}

export const GameCanvas = (props: Props) => {
	const game = useSelector((state: RootState) => state.game);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const { players, balls } = useContext(GameContext);
	const tick = useRef<number>(0);
	const drawTick = useRef<number>(0);

	let canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
		if (canvas !== null)
			setCtx(canvas.getContext('2d'));
	}, []);

	const gameInterval = useMemo<number>(() => 1000 / game.tps, [game.tps]);

	// useEffect(() => {
	// 	players.current = game.players.map(p => ({ ...p }));
	// }, [game.players]);

	const drawImage = useCallback((image: HTMLImageElement, x: number, y: number, dw: number, dh: number, rotation: number) => {
		ctx!.save();
		ctx!.setTransform(1, 0, 0, 1, x, y);
		ctx!.rotate(rotation);
		ctx!.drawImage(image, -dw / 2, -dh / 2, dw, dh);
		ctx!.restore();
	}, [ctx]);

	let draw = 1;
	useAnimationFrame((delta) => {
		if (ctx && draw) {
			++drawTick.current;

			const stepsPerTick = (1000 / game.tps) / delta;

			ctx.drawImage(backgroundImg, 0, 0, game.width, game.height);
			for (const player of players) {
				let diff = Math.abs(player.screenY - player.y);

				if (player.direction === Directions.STATIC) {
					player.screenY = player.y;
				} else {
					if (diff > player.speed * 2) {
						player.screenY = player.y;
					} else {
						if (player.direction === Directions.UP)
							player.screenY -= (player.speed / stepsPerTick);
						else
							player.screenY += (player.speed / stepsPerTick);
						let meuh = interpolate({ x: player.x, y: player.screenY }, { x: player.x, y: player.y }, 0.1);
						player.screenY = meuh.y;
					}
				}
				player.screenY = Math.max(Math.min(player.screenY, game.height - player.height), 0);

				ctx.drawImage(paddleImg, player.direction * spriteWidth, player.side * spriteHeight, spriteWidth, spriteHeight, player.x, player.screenY, player.width, player.height);

				ctx.strokeStyle = players[0] === player ? 'red' : 'blue';
				ctx.lineWidth = 4;
				// ctx.strokeRect(player.x, player.y, player.width, player.height);
			}
			for (const ball of balls) {
				let diff = Math.abs(Math.sqrt((ball.screenX - ball.x) ** 2 + (ball.screenY - ball.y) ** 2));
				if (diff > ball.speed * 2) {
					ball.screenX = ball.x;
					ball.screenY = ball.y;
				} else {
					let tmpX = ball.screenX + (ball.speed / stepsPerTick) * ball.direction.x;
					let tmpY = ball.screenY + (ball.speed / stepsPerTick) * ball.direction.y;
					let meuh = interpolate({ x: tmpX, y: tmpY }, { x: ball.x, y: ball.y }, 0.1);
					if (meuh.y + ball.radius > game.height && ball.direction.y > 0) {
						ball.direction.y *= -1;
						tmpY = ball.screenY + (ball.speed / stepsPerTick) * ball.direction.y;
						meuh = interpolate({ x: tmpX, y: tmpY }, { x: ball.x, y: ball.y }, 0.1);
					} else if (meuh.y - ball.radius < 0 && ball.direction.y < 0) {
						ball.direction.y *= -1;
						tmpY = ball.screenY + (ball.speed / stepsPerTick) * ball.direction.y;
						meuh = interpolate({ x: tmpX, y: tmpY }, { x: ball.x, y: ball.y }, 0.1);
					}
					ball.screenX = meuh.x;
					ball.screenY = meuh.y;
				}
				drawImage(ballImg, ball.screenX, ball.screenY, ball.radius * 2, ball.radius * 2, ((drawTick.current * ((ball.speed * 5) / 10)) % 360) * Math.PI / 180);

				ctx.strokeStyle = 'green';
				ctx.lineWidth = 4;
				// ctx.strokeRect(ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
			}

			ctx.textAlign = 'right';
			ctx.font = "30px monospace";
			ctx.textBaseline = 'top';
			ctx.fillStyle = "#ffffff55";
			ctx.fillText(Math.round(1000 / delta) + 'fps', game.width, 0);
		}
	}, [ctx, players, drawImage]);

	// useEffect(() => {
	// 	const loop = () => {
	// 	}

	// 	const intervalId = setInterval(loop, gameInterval);
	// 	return (() => {
	// 		clearInterval(intervalId);
	// 	});
	// }, [players, gameInterval]);

	return (
		<canvas className='border-neon-primary' ref={canvasRef} height={game.height} width={game.width}></canvas>
	);
};
