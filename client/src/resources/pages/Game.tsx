import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/socket';
import { Directions, GameStatus, Player, Sides } from '../../app/interfaces/Game.interface';
import { PacketPlayOutPlayerJoin } from '../../app/packets/PacketPlayOutPlayerJoin';
import { PacketPlayOutPlayerMove } from '../../app/packets/PacketPlayOutPlayerMove';
import { PacketPlayOutPlayerReady } from '../../app/packets/PacketPlayOutPlayerReady';
import { RootState } from '../../app/store';

let moveUp: boolean = false;
let moveDown: boolean = false;

export const Game = () => {
	const socket = useContext(SocketContext);
	const game = useSelector((state: RootState) => state.game)
	const [counter, setCounter] = useState<number>();

	const searchMatch = useCallback(() => {
		socket?.emit('game', new PacketPlayOutPlayerJoin());
	}, [socket]);

	const emitMovement = useCallback(() => {
		if (moveUp && moveDown) {
			return;
		}
		socket?.emit('game', new PacketPlayOutPlayerMove(moveUp ? Directions.UP : moveDown ? Directions.DOWN : Directions.STATIC));
	}, [socket]);

	const handleClick = useCallback(() => {
		if (game.status === GameStatus.WAITING) {
			socket?.emit('game', new PacketPlayOutPlayerReady());
		}
	}, [socket, game.status]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		if (game.status === GameStatus.WAITING) {
			if ((e.key === 'w' || e.key === 'ArrowUp') && !moveUp) {
				moveUp = true;
				emitMovement();
			}
			if ((e.key === 's' || e.key === 'ArrowDown') && !moveDown) {
				moveDown = true;
				emitMovement();
			}
		}
	}, [game.status, emitMovement]);

	const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		if (game.status === GameStatus.WAITING) {
			if (e.key === 'w' || e.key === 'ArrowUp') {
				moveUp = false;
				emitMovement();
			}
			if (e.key === 's' || e.key === 'ArrowDown') {
				moveDown = false;
				emitMovement();
			}
		}
	}, [game.status, emitMovement]);

	useEffect(() => {
		if (game.status === GameStatus.STARTING) {
			setCounter(game.startTime);
			let id = setInterval(() => {
				setCounter(counter => {
					let n = (counter ?? 0) - 1;
					if (n === 1)
						clearInterval(id);
					return n;
				});
			}, 1000);
			return () => clearInterval(id);
		}
		if (game.status === GameStatus.RUNNING) {
			setCounter(undefined);
		}
	}, [game.status, game.startTime]);

	const getMenu = useCallback((): JSX.Element => {
		return (
			<div className="buttonWindow">
				<button onMouseDown={searchMatch}>Search Match</button>
				{/* <button onMouseDown={() => createPrivRoom()}>Create private room</button>
				<input type="number" onKeyDown={joinPrivRoom} placeholder=" debug privRoom ID"/> */}
			</div>
		);
	}, [searchMatch]);

	const getGameInfos = useCallback((): JSX.Element => {
		if (game.status === GameStatus.MATCHMAKING) {
			return (
				<div className="roomSearchMatch">
					<div>Searching a game...</div>
				</div>
			);
		}

		const listPlayers = (players: Array<Player>): Array<JSX.Element> | JSX.Element => {
			return players.length ?
				players.map((player: Player) => (
					<div key={player.user.id}>
						<div className='avatar'>
							<img className="playerAvatar" src={player.user.avatar} width="120px" height="120px" alt=""></img>
							{player.ready && (
								<div className='overlay'>
									<h3 className='text-neon2-secondary text-stroke-1'>Ready</h3>
								</div>
							)}
						</div>
						<p>{player.user.name} <small>{player.user.login}</small></p>
					</div>
				)) : (
					<div>Searching...</div>
				);
		}

		let left = game.players.filter(p => p.side === Sides.LEFT);
		let right = game.players.filter(p => p.side === Sides.RIGHT);

		return (
			<section className='board'>
				<div className='players'>
					{listPlayers(left)}
				</div>
				<span className='h1 text-neon2-tertiary text-stroke-2'>{counter ?? 'VS'}</span>
				<div className='players'>
					{listPlayers(right)}
				</div>
			</section>
		);
	}, [game.status, game.players, counter]);

	return (
		<div id="game" onKeyDown={(e) => handleKeyDown(e)} onKeyUp={(e) => handleKeyUp(e)} onClick={() => handleClick()} tabIndex={-1}>
			<p>{ GameStatus[game.status] }</p>
			{game.status === GameStatus.NONE ? getMenu() : getGameInfos()}
		</div>
	);
};
