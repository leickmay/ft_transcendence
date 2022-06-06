import React, { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/socket';
import { Directions, GameData } from '../../app/interfaces/Game.interface';
import { PacketPlayInGameUpdate } from '../../app/packets/PacketPlayInGameUpdate';
import { PacketPlayInPlayerJoin } from '../../app/packets/PacketPlayInPlayerJoin';
import { PacketPlayInPlayerJoinWL } from '../../app/packets/PacketPlayInPlayerJoinWL';
import { PacketPlayOutGameInit } from '../../app/packets/PacketPlayOutGameInit';
import { PacketPlayOutPlayerJoin } from '../../app/packets/PacketPlayOutPlayerJoin';
import { PacketPlayOutPlayerMove } from '../../app/packets/PacketPlayOutPlayerMove';
import { PacketPlayOutPlayerReady } from '../../app/packets/PacketPlayOutPlayerReady';
import { Packet, PacketTypesGame, PacketTypesPlayer } from '../../app/packets/packetTypes';
import { RootState } from '../../app/store';
import { GameCanvas } from '../components/GameCanvas';

let moveUp: boolean = false;
let moveDown: boolean = false;

export const Game = () => {
	let canvasRef = useRef<HTMLCanvasElement>(null);
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);

	const gameData = useRef<GameData>();
	const [inMatchmaking, setInMatchmaking] = useState<boolean>(false);

	const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

	useEffect(() => {
		if (!gameData.current) {			
			socket?.emit('game', new PacketPlayOutGameInit());
		}
	}, []);

	const handleJoinWaitList = (packet: PacketPlayInPlayerJoinWL) => {
		setInMatchmaking(packet.searching);
	}

	const searchMatch = useCallback(() => {
		socket?.emit('game', new PacketPlayOutPlayerJoin());
	}, [socket]);
	
	const emitMovement = () => {
		if (moveUp && moveDown) {
			return;
		}
		socket?.emit('game', new PacketPlayOutPlayerMove(moveUp ? Directions.UP : moveDown ? Directions.DOWN : Directions.STATIC));
	}

	const handleClick = useCallback(() => {
		if (socket && gameData.current && user && !gameData.current.started) {
			socket.emit('game', new PacketPlayOutPlayerReady());
		}
	}, [socket, gameData]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (socket && gameData.current && gameData.current.started) {
			if ((e.key === 'w' || e.key === 'ArrowUp') && !moveUp) {
				moveUp = true;
				emitMovement();
			}
			if ((e.key === 's' || e.key === 'ArrowDown') && !moveDown) {
				moveDown = true;
				emitMovement();
			}
		}
	};

	const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (socket && gameData.current && gameData.current.started) {
			if (e.key === 'w' || e.key === 'ArrowUp') {
				moveUp = false;
				emitMovement();
			}
			if (e.key === 's' || e.key === 'ArrowDown') {
				moveDown = false;
				emitMovement();
			}
		}
	};

	const handleRoomCreate = (packet: PacketPlayInGameUpdate) => {
		if (!gameData.current) {
			console.log(packet);
			gameData.current = packet.data
		}
	}

	const handleJoin = (packet: PacketPlayInPlayerJoin) => {
		if (gameData.current && !gameData.current.players.find(p => p.user.id === packet.player.user.id)) {
			gameData.current.players.push(packet.player);
			forceUpdate();
		}

		if (gameData.current && gameData.current.players.length >= gameData.current.minPlayers) {
			//setWaitForPlay(false);
			//setShowGameResult(true);
		}
	}

	socket?.off('game').on('game', (packet: Packet): void => {
		switch (packet.packet_id) {
			case PacketTypesPlayer.JOIN:
				handleJoin(packet as PacketPlayInPlayerJoin);
				break;
			case PacketTypesPlayer.JOINWL:
				handleJoinWaitList(packet as PacketPlayInPlayerJoinWL);
				break;
			case PacketTypesGame.UPDATE:
				handleRoomCreate(packet as PacketPlayInGameUpdate);
				break;
			default:
				break;
		}
	});

	const getMenu = (): JSX.Element => {
		if (inMatchmaking) {
			return (
				<div className="roomSearchMatch">
					<div>Searching a game...</div>
				</div>
			);
		}
		return (
			<div className="buttonWindow">
				<button onMouseDown={searchMatch}>Search Match</button>
				{/* <button onMouseDown={() => createPrivRoom()}>Create private room</button>
				<input type="number" onKeyDown={joinPrivRoom} placeholder=" debug privRoom ID"/> */}
			</div>
		);
	}

	const getGameInfos = useCallback((): JSX.Element => {
		if (!gameData.current)
			return <></>;

		return (
			<div onKeyDown={(e) => handleKeyDown(e)} onKeyUp={(e) => handleKeyUp(e)} onClick={() => handleClick()} tabIndex={1}>
				(gameData.started ? <GameCanvas game={gameData.current} /> : <></>)
			</div>
		);
	}, [gameData]);

	return (
		<div id="game" className="game">
			{gameData ? getGameInfos() : getMenu()}
		</div>
	);
};
