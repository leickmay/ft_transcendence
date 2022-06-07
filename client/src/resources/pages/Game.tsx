import React, { createContext, MutableRefObject, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameDataContext } from '../../app/context/game';
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
	let gameData = useContext(GameDataContext);
	const user = useSelector((state: RootState) => state.users);

	const [inMatchmaking, setInMatchmaking] = useState<boolean>(false);
	const [showGameResult, setShowGameResult] = useState<boolean>(true);
	let counter: number = 0;

	const forceUpdate = useReducer(() => ({}), {})[1] as () => void;
	
	//useEffect(() => {forceUpdate(); console.log("refresh !");}, [gameData?.players[0]?.ready || gameData?.players[1]?.ready]);

	useEffect(() => {
		if (!gameData) {
			socket?.emit('game', new PacketPlayOutGameInit());
		}
	}, []);
	
	useEffect(() => {
		counter > -1 && setTimeout(() => --counter, 1000);
		if (counter === 3 && gameData && gameData && gameData.over) {
			setShowGameResult(false);
		}
	}, [counter]);

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
		if (socket && gameData && user && !gameData.started) {
			//console.log("click");
			socket.emit('game', new PacketPlayOutPlayerReady());
		}
	}, [socket, gameData]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (socket && gameData && gameData.started) {
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
		if (socket && gameData && gameData.started) {
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

	const handleGameUpdate = (packet: PacketPlayInGameUpdate) => {
		console.log("update Game");
		
		if (!gameData) {
			gameData = packet.data
			if (gameData.full) {
				setInMatchmaking(false);
				setShowGameResult(true);
				//forceUpdate();
			}
		}
	}

	const handleJoin = (packet: PacketPlayInPlayerJoin) => {
		console.log("Join");
		if (gameData && !gameData.players.find(p => p.user.id === packet.player.user.id)) {
			gameData.players.push(packet.player);
			console.log(gameData);
			forceUpdate();
		}
	}

	socket?.off('game').on('game', (packet: Packet): void => {
		//console.log(packet);
		
		switch (packet.packet_id) {
			case PacketTypesPlayer.JOIN:
				handleJoin(packet as PacketPlayInPlayerJoin);
				break;
			case PacketTypesPlayer.JOINWL:
				handleJoinWaitList(packet as PacketPlayInPlayerJoinWL);
				break;
			case PacketTypesGame.UPDATE:
				handleGameUpdate(packet as PacketPlayInGameUpdate);
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
		if (!gameData)
			return <></>;

		else if (gameData) {
			return (
				<div>
				{
					!gameData.over ? 
					<div className="roomInfo" >
						<div className="playerCard">
							<img className="playerAvatar" src={gameData.players[0].user.avatar} width="120px" alt=""></img>
							<div className="playerInfo">
								{gameData.players[0].user.login}
							</div>
							<div className="playerInfo">
								{gameData.players[1].user ? gameData.players[0].ready ? gameData.players[1].ready ? counter === -1 ? gameData.players[0].score : <div className="ready">Ready</div> : <div className="ready">Ready</div> : <div className="pressSpace">Click to start !</div> : <div className="pressSpace">room ID : {gameData.id}</div>}
							</div>
						</div>
						<div className="versus">VS</div>
							<div className="playerCard">
							<img className="playerAvatar" src={gameData.players[1].user ? gameData.players[1].user.avatar : "https://t3.ftcdn.net/jpg/02/55/85/18/360_F_255851873_s0dXKtl0G9QHOeBvDCRs6mlj0GGQJwk2.jpg"} width="120px" alt=""></img>
							<div className="playerInfo">
								{gameData.players[1].user ? gameData.players[1].user.login : "invite a friend"}
							</div>
							<div className="playerInfo">
								{gameData.players[1].user ? gameData.players[1].ready ? gameData.players[0].ready ? counter === -1 ? gameData.players[1].score : <div className="ready">Ready</div> : <div className="ready">Ready</div> : <div className="pressSpace">Click to start ! </div> : <div className="pressSpace">wait...</div>}
							</div>
						</div>
					</div>
					:
					<div className={showGameResult ? "roomInfo" : "roomInfoHide"}>
						<div className="playerCard">
							<div className="playerInfo">
								The winner is
							</div>
							<img className="playerAvatar" src={gameData.players[0].score > gameData.players[1].score ? gameData.players[0].user.avatar : gameData.players[1].user.avatar} width="120px" alt=""></img>
							<div></div>
							<div className="playerInfo">
								{gameData.players[0].score > gameData.players[1].score ? gameData.players[0].user.login : gameData.players[1].user.login}
							</div>
							<div className="playerInfo">
								leave in {counter - 1} seconds
							</div>
						</div>
					</div>
				}
				{
					gameData.over ?
					<div></div>
					:
					!gameData.players[0].ready ?
					<div className="roomSearchMatch">
						<div>wait for player</div>
						<div className="spinner-grow" role="status"></div>
					</div>
					:
					gameData.players[1].ready ?
					<div></div>
					:
					<div className="roomSearchMatch">
						<div>wait for player</div>
						<div className="spinner-grow" role="status"></div>
					</div>
				}
					<GameCanvas/>
				</div>
			);
		}
		else 
			return (<div></div>);
	}, [gameData]);

	return (
		<div id="game" className="game" onKeyDown={(e) => handleKeyDown(e)} onKeyUp={(e) => handleKeyUp(e)} onClick={() => handleClick()} tabIndex={-1}>
			{gameData ? getGameInfos() : getMenu()}
		</div>
	);
};
