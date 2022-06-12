import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/socket';
import { Directions, GameStatus } from '../../app/interfaces/Game.interface';
import { PacketPlayOutPlayerJoin } from '../../app/packets/PacketPlayOutPlayerJoin';
import { PacketPlayOutPlayerMove } from '../../app/packets/PacketPlayOutPlayerMove';
import { PacketPlayOutPlayerReady } from '../../app/packets/PacketPlayOutPlayerReady';
import { RootState } from '../../app/store';
import { GameMenu } from '../components/game/Menu';
import { GameCanvas } from '../components/GameCanvas';

let moveUp: boolean = false;
let moveDown: boolean = false;

interface Props {
}

export const Game = (props: Props) => {
	const socket = useContext(SocketContext);
	const game = useSelector((state: RootState) => state.game);

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
		if (game.status === GameStatus.RUNNING) {
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
		if (game.status === GameStatus.RUNNING) {
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

	console.log('Game refresh');

	return (
		<div id="game" onKeyDown={(e) => handleKeyDown(e)} onKeyUp={(e) => handleKeyUp(e)} onClick={() => handleClick()}>
			<p>{GameStatus[game.status]}</p>
			<GameMenu search={searchMatch} />
			{game.status >= GameStatus.STARTING && <GameCanvas />}
		</div>
	);
};
