import { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameContext } from '../../../app/context/GameContext';
import { SocketContext } from '../../../app/context/SocketContext';
import { GameStatus, Player, Sides } from '../../../app/interfaces/Game.interface';
import { RootState } from '../../../app/store';
import { PlayerCard } from '../PlayerCard';
import { PacketPlayOutPlayerLeave } from '../../../app/packets/PacketPlayOutPlayerLeave';
import { resourceLimits } from 'worker_threads';

interface Props {
	search: () => void;
}

export const GameMenu = (props: Props) => {
	const { players } = useContext(GameContext);
	const game = useSelector((state: RootState) => state.game);
	const socket = useContext(SocketContext);
	const [counter, setCounter] = useState<number>();
	const user = useSelector((state: RootState) => state.users.current);

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

	const leave = useCallback(() => {
		socket?.emit('game', new PacketPlayOutPlayerLeave());
	}, [socket]);

	const getMatchmakingElement = useCallback((): JSX.Element => {
		return (
			<div className="roomSearchMatch">
				<div>Searching a game...</div>
			</div>
		);
	}, []);

	const getGameInfosElement = useCallback((): JSX.Element => {
		const listPlayers = (players: Array<Player>): Array<JSX.Element> | JSX.Element => {
			return players.length ?
				players.map((player: Player) => (
					<PlayerCard key={player.user.id} player={player}></PlayerCard>
				)) : (
					<div>Searching...</div>
				);
		}

		let left = players.filter(p => p.side === Sides.LEFT);
		let right = players.filter(p => p.side === Sides.RIGHT);
		let winner = undefined;
		if (left.reduce((p, l) => p + l.score, 0) === 5)
			winner = left[0].user;
		else if (right.reduce((p, l) => p + l.score, 0) === 5)
			winner = right[0].user;

		return (
			<>
				<section>
					<button onClick={leave}>Leave</button>
				</section>
				<section className='board'>
					<div className='players'>
						{listPlayers(left)}
					</div>
					<span className='h1 text-neon2-tertiary text-stroke-2'>
						{game.status >= GameStatus.RUNNING ?
							<>
								<span>{left.reduce((p, l) => p + l.score, 0)}</span><span>-</span><span>{right.reduce((p, l) => p + l.score, 0)}</span>
							</>
							:
							counter ?? 'VS'
						}
					</span>
					<div className='players'>
						{listPlayers(right)}
					</div>
				</section>
				<section className='result'>
					{game.status === GameStatus.FINISHED ?
						winner?.id === user?.id ?
							<span className='h1 text-neon2-tertiary text-stroke-2'>
								<h2>VICTORY</h2>
							</span> : <span className='h1 text-neon2-tertiary text-stroke-2'>
								<h2>DEFEAT</h2>
							</span>

						: <></>}
				</section>
			</>
		);
	}, [players, counter, game.status]);



	switch (game.status) {
		case GameStatus.NONE:
			return <></>;
		case GameStatus.MATCHMAKING:
			return getMatchmakingElement();
		default:
			return getGameInfosElement();
	}
};
