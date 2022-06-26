import { useCallback, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameContext } from '../../../app/context/GameContext';
import { useAnimationFrame } from '../../../app/Helpers';
import { Directions, GameStatus, Sides, Vector2 } from '../../../app/interfaces/Game.interface';
import { RootState } from '../../../app/store';
import ballUrl from '../../../assets/images/ball.png';
import backgroundUrl from '../../../assets/images/game-background.png';
import paddleUrl from '../../../assets/images/paddles.png';

const spriteWidth: number = 110;
const spriteHeight: number = 450;

const backgroundImg = new Image(); backgroundImg.src = backgroundUrl;
const ballImg = new Image(); ballImg.src = ballUrl;
const paddleImg = new Image(); paddleImg.src = paddleUrl;

const intersect = (p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2): Vector2 | undefined => {
	// Check if none of the lines are of length 0
	if (p1.equals(p2) || p3.equals(p4))
		return undefined;

	let dir1 = p1.sub(p2);
	let dir2 = p3.sub(p4);

	let denominator = dir1.x * dir2.y - dir1.y * dir2.x;

	// Lines are parallel
	if (denominator === 0)
		return undefined;

	let lhs = p1.x * p2.y - p1.y * p2.x;
	let rhs = p3.x * p4.y - p3.y * p4.x;

	let px = (lhs * dir2.x - dir1.x * rhs) / denominator;
	let py = (lhs * dir2.y - dir1.y * rhs) / denominator;

	return new Vector2(px, py);
}

const verticalCollidesDist = (y: number, location: Vector2, direction: Vector2): number | undefined => {
	let inter = intersect(new Vector2(0, y), new Vector2(1, y), location, location.add(direction));
	if (inter)
		return location.distance(inter);
	return undefined;
}

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
						let meuh = new Vector2(player.location.x, player.screenY).interpolate(new Vector2(player.location.x, player.location.y), 0.1);
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
				let diff = ball.screen.location.distance(ball.location);

				if (diff > ball.speed * 2) { // TODO change					
					ball.screen.location = ball.location.clone();
					ball.screen.direction = ball.direction.clone();
				} else {
					let location = ball.screen.location.clone();
					let direction = ball.screen.direction.clone();

					let dist;

					if (dist = verticalCollidesDist(0, location.sub(new Vector2(0, ball.radius)), direction)) {
						if (dist < speed) {
							location = location.add(direction.mul(dist));
							direction.y = Math.abs(direction.y);
							location = location.add(direction.mul(speed - dist));
						}
					}
					if (dist = verticalCollidesDist(game.height, location.add(new Vector2(0, ball.radius)), direction)) {
						if (dist < speed) {
							location = location.add(direction.mul(dist));
							direction.y = -Math.abs(direction.y);
							location = location.add(direction.mul(speed - dist));
						}
					}
					for (const player of players) {
						let sideX = player.side === Sides.LEFT ? player.location.x + player.width : player.location.x;

						let inter = intersect(new Vector2(sideX, 0), new Vector2(sideX, 1), location.clone(), location.add(direction));
						if (inter) {
							let dist = location.distance(inter);
							if (dist < speed) {
								if (inter.y >= player.location.y && inter.y <= player.location.y + player.height) {
									let percent = (inter.y - player.location.y) - player.height / 2;
									console.log(percent);

									location = location.add(direction.mul(dist));
									direction.x = player.side === Sides.LEFT ? Math.abs(direction.x) : -Math.abs(direction.x);
									location = location.add(direction.mul(speed - dist));
								}
							}
						}
						inter = intersect(new Vector2(0, player.location.y), new Vector2(1, player.location.y), location.clone(), location.add(direction));
						if (inter) {
							let dist = location.distance(inter);
							if (dist < speed) {
								if (inter.x >= player.location.x && inter.x - 10 <= player.location.x + player.width) {
									location = location.add(direction.mul(dist));
									direction.x = player.side === Sides.LEFT ? Math.abs(direction.x) : -Math.abs(direction.x);
									direction.y = -Math.abs(direction.y);
									location = location.add(direction.mul(speed - dist));
								}
							}
						}
						inter = intersect(new Vector2(0, player.location.y + player.height), new Vector2(1, player.location.y + player.height), location.clone(), location.add(direction));
						if (inter) {
							let dist = location.distance(inter);
							if (dist < speed) {
								if (inter.x >= player.location.x && inter.x <= player.location.x + player.width) {
									location = location.add(direction.mul(dist));
									direction.x = player.side === Sides.LEFT ? Math.abs(direction.x) : -Math.abs(direction.x);
									direction.y = Math.abs(direction.y);
									location = location.add(direction.mul(speed - dist));
								}
							}
						}
					}
					if (location.equals(ball.screen.location))
						location = location.add(direction.mul(speed));

					ball.screen.location = location.interpolate(ball.location, 0.1);
					ball.screen.direction = direction;
				}
				drawImage(ballImg, ball.screen.location.x, ball.screen.location.y, ball.radius * 2, ball.radius * 2, ((drawTick.current * ((ball.speed * 5) / 10)) % 360) * Math.PI / 180);

				ctx.strokeStyle = 'green';
				ctx.lineWidth = 4;
				// ctx.strokeRect(ball.location.x - ball.radius, ball.location.y - ball.radius, ball.radius * 2, ball.radius * 2);
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
