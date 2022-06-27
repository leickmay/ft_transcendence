import { useCallback, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/SocketContext';
import { Directions, GameStatus } from '../../app/interfaces/Game.interface';
import { PacketPlayOutPlayerJoin } from '../../app/packets/PacketPlayOutPlayerJoin';
import { PacketPlayOutPlayerMove } from '../../app/packets/PacketPlayOutPlayerMove';
import { PacketPlayOutPlayerReady } from '../../app/packets/PacketPlayOutPlayerReady';
import { RootState } from '../../app/store';
import { GameCanvas } from '../components/game/GameCanvas';
import { GameMenu } from '../components/game/GameMenu';
import { GameOptions } from '../components/game/GameOptions';

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
			socket?.emit('game', new PacketPlayOutPlayerMove(Directions.STATIC));
			return;
		}
		socket?.emit('game', new PacketPlayOutPlayerMove(moveUp ? Directions.UP : moveDown ? Directions.DOWN : Directions.STATIC));
	}, [socket]);

	const handleClick = useCallback(() => {
		if (game.status === GameStatus.WAITING) {
			socket?.emit('game', new PacketPlayOutPlayerReady());
		}
	}, [socket, game.status]);

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (['w', 'ArrowUp', 's', 'ArrowDown'].indexOf(e.key) > -1) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (game.status === GameStatus.RUNNING) {
			if (['w', 'ArrowUp'].indexOf(e.key) > -1 && !moveUp) {
				moveUp = true;
				emitMovement();
			}
			if (['s', 'ArrowDown'].indexOf(e.key) > -1 && !moveDown) {
				moveDown = true;
				emitMovement();
			}
		}
	}, [game.status, emitMovement]);

	const handleKeyUp = useCallback((e: KeyboardEvent) => {
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

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, [handleKeyUp, handleKeyDown]);

	return (
		<div id="game" className='container' onClick={() => handleClick()}>
			{game.status === GameStatus.NONE ? <GameOptions/> : <></>}
			<GameMenu search={searchMatch} />
			{game.status >= GameStatus.WAITING && game.status < GameStatus.FINISHED && <GameCanvas />}
			{/*game.status === GameStatus.FINISHED ? <h2>FINISHED</h2>  : <></>*/}
			
		</div>
	);
};
