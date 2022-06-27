import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameContext } from '../../../app/context/GameContext';
import { SocketContext } from '../../../app/context/SocketContext';
import { GameStatus, Player, Sides } from '../../../app/interfaces/Game.interface';
import { PacketPlayOutPlayerLeave } from '../../../app/packets/PacketPlayOutPlayerLeave';
import { RootState } from '../../../app/store';
import { PlayerCard } from '../PlayerCard';
import moohUrl from "../../../assets/sounds/Cow.mp3"

interface Props {
	search: () => void;
}

export const GameMenu = (props: Props) => {
	const { players } = useContext(GameContext);
	const game = useSelector((state: RootState) => state.game);
	const socket = useContext(SocketContext);
	const [counter, setCounter] = useState<number>();
	const user = useSelector((state: RootState) => state.users.current);
	const oldScoresSum = useRef(-1);

	const audio = useMemo(() => new Audio(moohUrl), []);

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

		let isSpectator = players.find(p => p.user.id === user?.id);

		let leftScore = left.reduce((p, l) => p + l.score, 0);
		let rightScore = right.reduce((p, l) => p + l.score, 0);
		if (leftScore >= 5)
			winner = left[0].user;
		else if (rightScore >= 5)
			winner = right[0].user;

		if (leftScore + rightScore > oldScoresSum.current) {
			oldScoresSum.current = leftScore + rightScore;
			if (game.cowMode)
				audio.play();
		}

		return (
			<>
				<section>
					<button className="button-hovered" onClick={leave}>Leave</button>
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
						isSpectator ?
							winner?.id === user?.id ?
								<span className='h1 text-neon2-tertiary text-stroke-2'>
									<h2>VICTORY</h2>
								</span>
								:
								<span className='h1 text-neon2-tertiary text-stroke-2'>
									<h2>DEFEAT</h2>
								</span>
							:
							<span className='h1 text-neon2-tertiary text-stroke-2'>
								<h2>{winner?.name} WON</h2>
							</span>
						:
						<></>}
				</section>
			</>
		);
	}, [players, counter, game.status, leave, user?.id, game.cowMode, audio]);

	switch (game.status) {
		case GameStatus.NONE:
			return <></>;
		case GameStatus.MATCHMAKING:
			return getMatchmakingElement();
		default:
			return getGameInfosElement();
	}
};
