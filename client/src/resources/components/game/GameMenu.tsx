import { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameContext } from '../../../app/context/GameContext';
import { GameStatus, Player, Sides } from '../../../app/interfaces/Game.interface';
import { RootState } from '../../../app/store';
import { Game } from '../../pages/Game';
import { PlayerCard } from '../PlayerCard';

interface Props {
	search: () => void;
}

export const GameMenu = (props: Props) => {
	const { players } = useContext(GameContext);
	const game = useSelector((state: RootState) => state.game);
	const [counter, setCounter] = useState<number>();

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

	const getSearchButtonElement = useCallback((): JSX.Element => {
		return (
			<div className="buttonWindow">
				<button onMouseDown={props.search}>Search Match</button>
				{/* <button onMouseDown={() => createPrivRoom()}>Create private room</button>
				<input type="number" onKeyDown={joinPrivRoom} placeholder=" debug privRoom ID"/> */}
			</div>
		);
	}, [props.search]);

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

		return (
			<section className='board'>
				<div className='players'>
					{listPlayers(left)}
				</div>
				<span className='h1 text-neon2-tertiary text-stroke-2'>
					{game.status === GameStatus.RUNNING ?
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
		);
	}, [players, counter]);

	switch (game.status) {
		case GameStatus.NONE:
			return getSearchButtonElement();
		case GameStatus.MATCHMAKING:
			return getMatchmakingElement();
		default:
			return getGameInfosElement();
	}
};
