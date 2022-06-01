import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/socket';
import { Ball, CreatePlayerDto, Directions, Room } from '../../app/interfaces/Game.interface';
import { PacketPlayInBallsMove } from '../../app/packets/PacketPlayInBallsMove';
import { PacketPlayInPlayerJoin } from '../../app/packets/PacketPlayInPlayerJoin';
import { PacketPlayInPlayerJoinWL } from '../../app/packets/PacketPlayInPlayerJoinWL';
import { PacketPlayInPlayerList } from '../../app/packets/PacketPlayInPlayerList';
import { PacketPlayInPlayerMove } from '../../app/packets/PacketPlayInPlayerMove';
import { PacketPlayInPlayerReady } from '../../app/packets/PacketPlayInPlayerReady';
import { PacketPlayOutPlayerJoin } from '../../app/packets/PacketPlayOutPlayerJoin';
import { PacketPlayOutPlayerMove } from '../../app/packets/PacketPlayOutPlayerMove';
import { PacketPlayOutPlayerReady } from '../../app/packets/PacketPlayOutPlayerReady';
import { Packet, PacketTypesBalls, PacketTypesPlayer } from '../../app/packets/packetTypes';
import { RootState } from '../../app/store';

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let background: HTMLImageElement = new Image();
background.src = './assets/images/background.png'
let ball: HTMLImageElement = new Image();
ball.src = './assets/images/ball.png'
let paddle1: HTMLImageElement = new Image();
let paddle2: HTMLImageElement = new Image();

const spriteUrl = '/assets/images/paddles.png';
const spriteWidth = 110;
const spriteHeight = 450;
let paddle: HTMLImageElement = new Image();
paddle.src = spriteUrl;

export const Game = () => {
	let canvasRef = useRef<HTMLCanvasElement>(null)
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);

	const [curRoom, setCurRoom] = useState<Room>({
		id: 0,
		raf : undefined,
		height: 1080,
		width: 1920,
		isPriv: false,
		isFull: false,
		isStart: false,
		isOver: false,
		p1: undefined,
		p2: undefined,
		balls: [],
		spectators: [],
	});
	const [counter, setCounter] = useState<number>(0);
	const [waitForPlay, setWaitForPlay] = useState<boolean>(false);
	const [showGameResult, setShowGameResult] = useState<boolean>(true);
	
	let moveUp: boolean = false;
	let moveDown: boolean = false;
	
	useEffect(() => {
		if (curRoom.p1?.ready && curRoom.p2?.ready) {
			initGame();
			draw();
		}
	}, [curRoom.p1?.ready, curRoom.p2?.ready]);

	useEffect(() => {
		counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
		draw();
		if (counter === 3 && curRoom?.isOver) {
			setShowGameResult(false);
		}
	}, [counter]);
	


	async function initGame() {
		canvas = canvasRef.current;
		if (!canvas)
			return ;
		canvas.style.animationName = 'appearCvs';
		ctx = canvas!.getContext('2d');
	}

	const draw = () => {
		if (ctx && curRoom.p1 && curRoom.p2) {
			ctx.drawImage(background, 0, 0, curRoom.width, curRoom.height);
			//if (counter !== 0 && curRoom.isStart && !curRoom.isOver) {
			//	ctx.font = '50px Arial';
			//	ctx.fillStyle = 'purple';
			//	ctx.fillText('Start in ' + (counter - 1) + ' seconds', curRoom.width / 2.5, curRoom.height / 1.8);
			//}
			let p1sx:number = curRoom.p1.direction === Directions.UP ? spriteWidth : curRoom.p1.direction === Directions.DOWN ? spriteWidth * 2 : 0;
			let p2sx:number = curRoom.p2.direction === Directions.UP ? spriteWidth : curRoom.p2.direction === Directions.DOWN ? spriteWidth * 2 : 0;
			ctx.drawImage(paddle, p1sx, 0, spriteWidth, spriteHeight, curRoom.p1.x * 0.20, curRoom.p1.y * 0.98, curRoom.p1.width * 1.6, curRoom.p1.height * 1.1);
			ctx.drawImage(paddle, p2sx, spriteHeight, spriteWidth, spriteHeight, curRoom.p2.x * 0.993, curRoom.p2.y * 0.98, curRoom.p2.width * 1.6, curRoom.p2.height * 1.1);
			if (curRoom.balls[0])
				ctx.drawImage(ball, curRoom.balls[0].x * 0.95, curRoom.balls[0].y * 0.91, curRoom.balls[0].size * 7 , curRoom.balls[0].size * 7);
		}

	}

	function joinRoom() {
		socket?.emit('game', new PacketPlayOutPlayerJoin());
	}

	function emitMovement() {
		if (moveUp && moveDown) {
			return;
		}
		socket?.emit('game', new PacketPlayOutPlayerMove(moveUp ? Directions.UP : moveDown ? Directions.DOWN : Directions.STATIC));
	}

	function handleClick() {
		if (socket && curRoom && user && !curRoom.isStart) {
			socket.emit('game', new PacketPlayOutPlayerReady());
		}
	};

	function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (socket  && curRoom.p1?.ready && curRoom.p1?.ready) {
			if (e.key === 'w') {
				moveUp = true;
				emitMovement();
			}
			if (e.key === 's') {
				moveDown = true;
				emitMovement();
			}
		}
	};

	function handleKeyUp(e: React.KeyboardEvent<HTMLDivElement>) {
		if (socket  && curRoom.p1?.ready && curRoom.p1?.ready) {
			if (e.key === 'w') {
				moveUp = false;
				emitMovement();
			}
			if (e.key === 's') {
				moveDown = false;
				emitMovement();
			}
		}
	
	};

	function handleJoinWaitList(packet: PacketPlayInPlayerJoinWL) {
		setWaitForPlay(packet.searching);
	}

	function handlePlayerList(packet: PacketPlayInPlayerList) {
		if(packet.players.length === 0) return
		else if (packet.players.length === 1) {
			setCurRoom((prevState: Room) => ({
                ...prevState,
                p1: packet.players[0],
            }));
		}
	}

	function handleJoin(packet: PacketPlayInPlayerJoin) {
		if (!curRoom.p1) {
			setCurRoom((prevState: Room) => ({
                ...prevState,
                p1: packet.player,
            }));
		}
		else if (!curRoom.p2) {
			setCurRoom((prevState: Room) => ({
                ...prevState,
                p2: packet.player,
            }));
		}
		if (curRoom.p1 && curRoom.p2) {
			setWaitForPlay(false);
			setShowGameResult(true);
			initGame();
			draw();
		}
	}
 
	function handleReady(packet: PacketPlayInPlayerReady) {
		packet.player.user.login === curRoom.p1!.user.login ?
		setCurRoom((prevState: Room) => ({
			...prevState,
			p1: packet.player,
		}))
		:
		setCurRoom((prevState: Room) => ({
			...prevState,
			p2: packet.player,
		}))
	}

	function handlePlayerMove(packet: PacketPlayInPlayerMove) {
		packet.player.user.login === curRoom.p1!.user.login ?
		setCurRoom((prevState: Room) => ({
			...prevState,
			p1: packet.player,
		}))
		:
		setCurRoom((prevState: Room) => ({
			...prevState,
			p2: packet.player,
		}))
		draw();
	}

	function handleBallsMove(packet: PacketPlayInBallsMove) {
		console.log(packet);
		if(curRoom.balls.length < packet.id + 1) {
			curRoom.balls.push({size: packet.size, x: packet.x, y: packet.y} as Ball)
		}
		curRoom.balls[packet.id].size = packet.size;
		curRoom.balls[packet.id].x = packet.x;
		curRoom.balls[packet.id].y = packet.y;
		draw();
	}

	socket?.off('game').on('game', (packet: Packet): void => {
		switch (packet.packet_id) {
			case PacketTypesPlayer.JOINWL:
				handleJoinWaitList(packet as PacketPlayInPlayerJoinWL);
				break;
			case PacketTypesPlayer.LIST:
				handlePlayerList(packet as PacketPlayInPlayerList);
				break;
			case PacketTypesPlayer.JOIN:
				handleJoin(packet as PacketPlayInPlayerJoin);
				break;
			case PacketTypesPlayer.READY:
				handleReady(packet as PacketPlayInPlayerReady);
				break;
			case PacketTypesPlayer.MOVE:
				handlePlayerMove(packet as PacketPlayInPlayerMove);
				break;
			case PacketTypesBalls.MOVE:
				handleBallsMove(packet as PacketPlayInBallsMove);
				break;
			default:
				break;
		}
	});

	return (
		<div id="game" className="game">
		{(() => {
			if (!curRoom.p1 && !curRoom.p2) {
				if (!waitForPlay) {
					return (
						<div className="buttonWindow">
							<button onMouseDown={() => joinRoom()}>Search Match</button>
							{/* <button onMouseDown={() => createPrivRoom()}>Create private room</button>
							<input type="number" onKeyDown={joinPrivRoom} placeholder=" debug privRoom ID"/> */}
						</div>);
				}
				if (waitForPlay) {
					return (
						<div className="roomSearchMatch">
							<div>search matchmaking</div>
							<div className="spinner-grow" role="status"></div>
						</div>);
				}
			}
			if (curRoom.p1 && curRoom.p2) {
				return (
					<div onKeyDown={(e) => handleKeyDown(e)} onKeyUp={(e) => handleKeyUp(e)} onClick={() => handleClick()} tabIndex={-1}>
					{
						!curRoom.isOver ?
						<div className="roomInfo" >
							<div className="playerCard">
								<img className="playerAvatar" src={curRoom.p1.user.avatar} width="120px" alt=""></img>
								<div className="playerInfo">
									{curRoom.p1.user.login}
								</div>
								<div className="playerInfo">
									{curRoom.p2.user ? curRoom.p1.ready ? curRoom.p2.ready ? counter === 0 ? curRoom.p1.score : <div className="ready">Ready</div> : <div className="ready">Ready</div> : <div className="pressSpace">Click to start !</div> : <div className="pressSpace">room ID : {curRoom.id}</div>}
								</div>
							</div>
							<div className="versus">VS</div>
								<div className="playerCard">
								<img className="playerAvatar" src={curRoom.p2.user ? curRoom.p2.user.avatar : "https://t3.ftcdn.net/jpg/02/55/85/18/360_F_255851873_s0dXKtl0G9QHOeBvDCRs6mlj0GGQJwk2.jpg"} width="120px" alt=""></img>
								<div className="playerInfo">
									{curRoom.p2.user ? curRoom.p2.user.login : "invite a friend"}
								</div>
								<div className="playerInfo">
									{curRoom.p2.user ? curRoom.p2.ready ? curRoom.p1.ready ? counter === 0 ? curRoom.p2.score : <div className="ready">Ready</div> : <div className="ready">Ready</div> : <div className="pressSpace">Click to start ! </div> : <div className="pressSpace">wait...</div>}
								</div>
							</div>
						</div>
						:
						<div className={showGameResult ? "roomInfo" : "roomInfoHide"}>
							<div className="playerCard">
								<div className="playerInfo">
									The winner is
								</div>
								<img className="playerAvatar" src={curRoom.p1.score > curRoom.p2.score ? curRoom.p1.user.avatar : curRoom.p2.user.avatar} width="120px" alt=""></img>
								<div></div>
								<div className="playerInfo">
									{curRoom.p1.score > curRoom.p2.score ? curRoom.p1.user.login : curRoom.p2.user.login}
								</div>
								<div className="playerInfo">
									leave in {counter - 1} seconds
								</div>
							</div>
						</div>
					}
					{
						curRoom.isOver ?
						<div></div>
						:
						!curRoom.p1.ready ?
						<div className="roomSearchMatch">
							<div>wait for player</div>
							<div className="spinner-grow" role="status"></div>
						</div>
						:
						curRoom.p2.ready ?
						<div></div>
						:
						<div className="roomSearchMatch">
							<div>wait for player</div>
							<div className="spinner-grow" role="status"></div>
						</div>
					}
					<canvas className="canvas" ref={canvasRef} height={curRoom.height} width={curRoom.width}></canvas>
					</div>);
				}
		})()}
		</div>
	);
};
