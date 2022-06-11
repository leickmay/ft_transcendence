import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameStatus, Player, Sides } from '../../../app/interfaces/Game.interface';
import { RootState } from '../../../app/store';

interface Props {
	search: () => void;
}

export const GameMenu = (props: Props) => {
	const game = useSelector((state: RootState) => state.game)
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
	}, [props.search]);

	const getGameInfosElement = useCallback((): JSX.Element => {
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
	}, [game.players, counter]);

	switch (game.status) {
		case GameStatus.NONE:
			return getSearchButtonElement();
		case GameStatus.MATCHMAKING:
			return getMatchmakingElement();
		default:
			return getGameInfosElement();
	}
};
