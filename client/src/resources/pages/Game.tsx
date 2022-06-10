import React, { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/socket';
import { Directions, GameData, GameStatus, Player, Sides } from '../../app/interfaces/Game.interface';
import { PacketPlayInGameStatusStart } from '../../app/packets/PacketPlayInGameStatusStart';
import { PacketPlayInGameStatusStarting } from '../../app/packets/PacketPlayInGameStatusStarting';
import { PacketPlayInGameUpdate } from '../../app/packets/PacketPlayInGameUpdate';
import { PacketPlayInPlayerJoin } from '../../app/packets/PacketPlayInPlayerJoin';
import { PacketPlayInPlayerJoinWL } from '../../app/packets/PacketPlayInPlayerJoinWL';
import { PacketPlayInPlayerList } from '../../app/packets/PacketPlayInPlayerList';
import { PacketPlayInPlayerReady } from '../../app/packets/PacketPlayInPlayerReady';
import { PacketPlayOutPlayerJoin } from '../../app/packets/PacketPlayOutPlayerJoin';
import { PacketPlayOutPlayerMove } from '../../app/packets/PacketPlayOutPlayerMove';
import { PacketPlayOutPlayerReady } from '../../app/packets/PacketPlayOutPlayerReady';
import { Packet, PacketTypesGame, PacketTypesPlayer } from '../../app/packets/packetTypes';
import { RootState } from '../../app/store';

let moveUp: boolean = false;
let moveDown: boolean = false;

export const Game = () => {
	let canvasRef = useRef<HTMLCanvasElement>(null);
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);

	let gameData = useRef<GameData>();

	const [inMatchmaking, setInMatchmaking] = useState<boolean>(false);
	const [showGameResult, setShowGameResult] = useState<boolean>(true);
	const [counter, setCounter] = useState<number>();

	const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

	const handleJoinWaitList = (packet: PacketPlayInPlayerJoinWL) => {
		console.log("Searching");

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
		if (gameData.current?.status === GameStatus.WAITING) {
			socket?.emit('game', new PacketPlayOutPlayerReady());
		}
	}, [socket, gameData.current]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (gameData.current?.status === GameStatus.WAITING) {
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
		if (gameData.current?.status === GameStatus.WAITING) {
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
		if (!gameData.current) {
			gameData.current = {
				width: 1920,
				height: 1080,
				status: GameStatus.WAITING,
				maxPlayers: 2,
				minPlayers: 2,
				players: [],
				balls: [],
			};
		}
		gameData.current = { ...gameData.current, ...packet.data };
		forceUpdate();
	}

	const handleJoin = (packet: PacketPlayInPlayerJoin) => {
		gameData.current?.players.push(packet.player);
		forceUpdate();
	}

	const handlePlayerReady = (packet: PacketPlayInPlayerReady) => {
		let player = gameData.current?.players.find(p => p.user.id === packet.player);
		if (player)
			player.ready = true;
		forceUpdate();
	}

	const handlePlayersList = (packet: PacketPlayInPlayerList) => {
		if (gameData.current) {
			gameData.current.players = packet.players;
			forceUpdate();
		}
	}

	const handleGameStart = (packet: PacketPlayInGameStatusStart) => {
		// if (gameData.current) {
		// 	gameData.current.players = packet.players;
		// 	forceUpdate();
		// }
	}

	const handleGameStarting = useCallback((packet: PacketPlayInGameStatusStarting) => {
		if (gameData.current && gameData.current.status === GameStatus.WAITING) {
			gameData.current.status = GameStatus.STARTING;

			setCounter(packet.time);
			let id = setInterval(() => {
				setCounter(counter => {
					let n = (counter ?? 0) - 1;
					if (n === 0)
						clearInterval(id);
					return n;
				});
			}, 1000);
			return () => clearInterval(id);
		}
	}, [gameData.current?.status]);

	useEffect(() => {
		socket?.off('game').on('game', (packet: Packet): void => {
			switch (packet.packet_id) {
				case PacketTypesPlayer.JOIN:
					handleJoin(packet as PacketPlayInPlayerJoin);
					break;
				case PacketTypesPlayer.JOINWL:
					handleJoinWaitList(packet as PacketPlayInPlayerJoinWL);
					break;
				case PacketTypesPlayer.READY:
					handlePlayerReady(packet as PacketPlayInPlayerReady);
					break;
				case PacketTypesPlayer.LIST:
					handlePlayersList(packet as PacketPlayInPlayerList);
					break;
				case PacketTypesGame.UPDATE:
					handleGameUpdate(packet as PacketPlayInGameUpdate);
					break;
				case PacketTypesGame.STARTING:
					handleGameStarting(packet as PacketPlayInGameStatusStarting);
					break;
				case PacketTypesGame.START:
					handleGameStart(packet as PacketPlayInGameStatusStart);
					break;
				default:
					break;
			}
		});
	}, [socket]);

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

		let left = gameData.current.players.filter(p => p.side === Sides.LEFT);
		let right = gameData.current.players.filter(p => p.side === Sides.RIGHT);

		return (
			<section className='board'>
				<div className='players'>
					{listPlayers(left)}
				</div>
				<span className='h1 text-neon2-tertiary text-stroke-2'>{counter ?? 'VS'}</span>
				<div className='players'>
					{listPlayers(right)}
				</div>
				{/* {
					!gameData.current.over ?
						<div className="roomInfo">
							<div className="playerCard">
								<img className="playerAvatar" src={gameData.current.players[0].user.avatar} width="120px" alt=""></img>
								<div className="playerInfo">
									{gameData.current.players[0].user.login}
								</div>
								<div className="playerInfo">
									{gameData.current.players[1].user ? gameData.current.players[0].ready ? gameData.current.players[1].ready ? counter === -1 ? gameData.current.players[0].score : <div className="ready">Ready</div> : <div className="ready">Ready</div> : <div className="pressSpace">Click to start !</div> : <div className="pressSpace">Starting</div>}
								</div>
							</div>
							<div className="versus">VS</div>
							<div className="playerCard">
								<img className="playerAvatar" src={gameData.current.players[1].user ? gameData.current.players[1].user.avatar : "https://t3.ftcdn.net/jpg/02/55/85/18/360_F_255851873_s0dXKtl0G9QHOeBvDCRs6mlj0GGQJwk2.jpg"} width="120px" alt=""></img>
								<div className="playerInfo">
									{gameData.current.players[1].user ? gameData.current.players[1].user.login : "invite a friend"}
								</div>
								<div className="playerInfo">
									{gameData.current.players[1].user ? gameData.current.players[1].ready ? gameData.current.players[0].ready ? counter === -1 ? gameData.current.players[1].score : <div className="ready">Ready</div> : <div className="ready">Ready</div> : <div className="pressSpace">Click to start ! </div> : <div className="pressSpace">wait...</div>}
								</div>
							</div>
						</div>
						:
						<div className={showGameResult ? "roomInfo" : "roomInfoHide"}>
							<div className="playerCard">
								<div className="playerInfo">
									The winner is
								</div>
								<img className="playerAvatar" src={gameData.current.players[0].score > gameData.current.players[1].score ? gameData.current.players[0].user.avatar : gameData.current.players[1].user.avatar} width="120px" alt=""></img>
								<div></div>
								<div className="playerInfo">
									{gameData.current.players[0].score > gameData.current.players[1].score ? gameData.current.players[0].user.login : gameData.current.players[1].user.login}
								</div>
								<div className="playerInfo">
									leave in {counter - 1} seconds
								</div>
							</div>
						</div>
				} */}
				{/* {
					gameData.current.over ?
						<div></div>
						:
						!gameData.current.players[0].ready ?
							<div className="roomSearchMatch">
								<div>wait for player</div>
								<div className="spinner-grow" role="status"></div>
							</div>
							:
							gameData.current.players[1].ready ?
								<div></div>
								:
								<div className="roomSearchMatch">
									<div>wait for player</div>
									<div className="spinner-grow" role="status"></div>
								</div>
				} */}
				{/* <GameCanvas /> */}
			</section>
		);
	}, [gameData.current?.players, counter]);

	return (
		<div id="game" onKeyDown={(e) => handleKeyDown(e)} onKeyUp={(e) => handleKeyUp(e)} onClick={() => handleClick()} tabIndex={-1}>
			{gameData.current ? getGameInfos() : getMenu()}
		</div>
	);
};
