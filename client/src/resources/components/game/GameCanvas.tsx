import { useCallback, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameContext } from '../../../app/context/GameContext';
import { useAnimationFrame } from '../../../app/Helpers';
import { Directions, GameStatus, Vector2 } from '../../../app/interfaces/Game.interface';
import { RootState } from '../../../app/store';
import ballUrl from '../../../assets/images/ball.png';
import backgroundUrl from '../../../assets/images/game-background.png';
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

// const intersect = (p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2): Vector2 | undefined => {
// 	// Check if none of the lines are of length 0
// 	if (p1.equals(p2) || p3.equals(p4))
// 		return undefined;

// 	let dir1 = p1.clone().sub(p2);
// 	let dir2 = p3.clone().sub(p4);

// 	let denominator = dir1.x * dir2.y - dir1.y * dir2.x;

// 	// Lines are parallel
// 	if (denominator === 0) {
// 		return undefined;
// 	}

// 	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
// 	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

// 	// is the intersection along the segments
// 	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
// 		return undefined;
// 	}

// 	// Return a object with the x and y coordinates of the intersection
// 	let x = x1 + ua * (x2 - x1);
// 	let y = y1 + ua * (y2 - y1);

// 	return new Vector2(x, y);
// }

interface Props {
}

export const GameCanvas = (props: Props) => {
	const game = useSelector((state: RootState) => state.game);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const { players, balls } = useContext(GameContext);
	const currentUser = useSelector((state: RootState) => state.users.current);
	const drawTick = useRef<number>(0);
	// const tick = useRef<number>(0);

	// const gameInterval = useMemo<number>(() => 1000 / game.tps, [game.tps]);

	let canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
		if (canvas !== null)
			setCtx(canvas.getContext('2d'));
	}, []);


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
				let diff = Math.abs(player.screenY - player.location.y);

				if (player.direction === Directions.STATIC) {
					player.screenY = player.location.y;
				} else {
					if (diff > player.speed * 2) {
						player.screenY = player.location.y;
					} else {
						if (player.direction === Directions.UP)
							player.screenY -= (player.speed / stepsPerTick);
						else
							player.screenY += (player.speed / stepsPerTick);
						let meuh = interpolate({ x: player.location.x, y: player.screenY }, { x: player.location.x, y: player.location.y }, 0.1);
						player.screenY = meuh.y;
					}
				}
				player.screenY = Math.max(Math.min(player.screenY, game.height - player.height), 0);

				ctx.drawImage(paddleImg, player.direction * spriteWidth, player.side * spriteHeight, spriteWidth, spriteHeight, player.location.x, player.screenY, player.width, player.height);

				ctx.strokeStyle = players[0] === player ? 'red' : 'blue';
				ctx.lineWidth = 4;
				// ctx.strokeRect(player.x, player.y, player.width, player.height);
			}
			for (const ball of balls) {
				let speed = ball.speed / stepsPerTick;
				let diff = ball.screen.location.distance(ball.direction);
				if (diff > ball.speed * /* 2 */ 20) { // TODO change
					ball.screen.location = ball.location;
					ball.screen.direction = ball.direction;
				} else {
					let tmp = ball.location.clone().add(ball.direction.clone().mul(speed));

					// intersect(new Vector2(), new Vector2(game.width, 0), ball.screen.location, tmp)

					// let meuh = { x: tmpX, y: tmpY };

					// if (meuh.y + ball.radius > game.height && ball.screenDirection.y > 0) {
					// 	ball.screenDirection.y = -Math.abs(ball.screenDirection.y);
					// } else if (meuh.y - ball.radius < 0 && ball.screenDirection.y < 0) {
					// 	ball.screenDirection.y = Math.abs(ball.screenDirection.y);
					// }

					// let meuh = interpolate({ x: tmpX, y: tmpY }, { x: ball.x, y: ball.y }, 0.1);
					// if (meuh.y + ball.radius > game.height && ball.direction.y > 0) {
					// 	ball.direction.y *= -1;
					// 	tmpY = ball.screenY + (ball.speed / stepsPerTick) * ball.direction.y;
					// 	meuh = interpolate({ x: tmpX, y: tmpY }, { x: ball.x, y: ball.y }, 0.1);
					// } else if (meuh.y - ball.radius < 0 && ball.direction.y < 0) {
					// 	ball.direction.y *= -1;
					// 	tmpY = ball.screenY + (ball.speed / stepsPerTick) * ball.direction.y;
					// 	meuh = interpolate({ x: tmpX, y: tmpY }, { x: ball.x, y: ball.y }, 0.1);
					// }
					// ball.screenX = meuh.x;
					// ball.screenY = meuh.y;
				}
				// drawImage(ballImg, ball.screenX, ball.screenY, ball.radius * 2, ball.radius * 2, ((drawTick.current * ((ball.speed * 5) / 10)) % 360) * Math.PI / 180);

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
		<div className="canvas">
			<canvas className='border-neon-primary' ref={canvasRef} height={game.height} width={game.width}>
			</canvas>
			{game.status === GameStatus.WAITING &&
				<div className="overlay">
					<span className='h2'>
						{players.some(p => p.user.id === currentUser?.id && p.ready) ?
							<>Waiting for others players</>
							:
							<>Click to start</>
						}
					</span>
				</div>
			}
		</div>
	);
};
