import React, { useEffect, useState, useRef } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { RootState } from "../../app/store";
import { Directions, GameEvents, GamePacket, Room } from "../../app/interfaces/Game.interface"

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let background: HTMLImageElement = new Image();
let ball: HTMLImageElement = new Image();
let paddle1: HTMLImageElement = new Image();
let paddle2: HTMLImageElement = new Image();

export const Game = () => {
	let canvasRef = useRef<HTMLCanvasElement>(null)
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);

	const [curRoom, setCurRoom] = useState<Room | null>();
	const [counter, setCounter] = useState<number>(0);
	const [waitForPlay, setWaitForPlay] = useState<boolean>(false);
	const [showGameResult, setShowGameResult] = useState<boolean>(true);
	
	let moveUp: boolean = false;
	let moveDown: boolean = false;
	
	useEffect(() => {
		if (curRoom?.isFull) {
			initGame();
			draw();
		}
	}, [curRoom?.isFull]);

	useEffect(() => {
		counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
		draw();
		if (counter === 3 && curRoom?.isOver) {
			setShowGameResult(false);
		}
		if (counter === 1 && curRoom?.isOver) {
			clearRoom();
		}
	}, [counter]);
	
	async function initGame() {
			canvas = canvasRef.current;
			if (!canvas)
				return ;
			ctx = canvas!.getContext('2d');
			paddle1.src = curRoom!.p1.paddleSrc;
			paddle2.src = curRoom!.p2.paddleSrc;
			ball.src = curRoom!.balls[0].ballSrc;
	}

	const draw = () => {
		if (ctx && curRoom) {
			//ctx.fillStyle = "black";
			//ctx.fillRect(0, 0, curRoom.width, curRoom.height);
			//ctx.fillStyle = "pink";
			//ctx.fillRect(curRoom.p1.x , curRoom.p1.y , curRoom.p1.width * 1.3 , curRoom.p1.height * 1.05);
			//ctx.fillRect(curRoom.p2.x * 0.9965 , curRoom.p2.y , curRoom.p2.width * 1.3 , curRoom.p2.height * 1.05);
			//ctx.fillStyle = "purple";
			//ctx.fillRect(curRoom.p1.x , curRoom.p1.y , curRoom.p1.width , curRoom.p1.height);
			//ctx.fillRect(curRoom.p2.x * 1.0020 , curRoom.p2.y , curRoom.p2.width , curRoom.p2.height);
			//ctx.fillStyle = "pink";
			//ctx.beginPath();
			//ctx.arc(curRoom.balls[0].x, curRoom.balls[0].y, curRoom.balls[0].size, 0, Math.PI*2);
			//ctx.fill();
			background.src = './assets/images/background.png'
			ctx.drawImage(background, 0, 0, curRoom.width, curRoom.height);
			if (counter !== 0 && curRoom.isStart && !curRoom.isOver) {
				ctx.font = "50px Arial";
				ctx.fillStyle = "purple";
				ctx.fillText("Start in " + (counter - 1) + " seconds", curRoom.width / 2.5, curRoom.height / 1.8);
			}
			paddle1.src = curRoom.p1.paddleSrc;
			ctx.drawImage(paddle1, curRoom.p1.x * 0.20, curRoom.p1.y * 0.98, curRoom.p1.width * 1.6, curRoom.p1.height * 1.1);
			
			paddle2.src = curRoom.p2.paddleSrc;
			ctx.drawImage(paddle2, curRoom.p2.x * 0.993, curRoom.p2.y * 0.98, curRoom.p2.width * 1.6, curRoom.p2.height * 1.1);
			
			ball.src = curRoom.balls[0].ballSrc;
			ctx.drawImage(ball, curRoom.balls[0].x * 0.95, curRoom.balls[0].y * 0.91, curRoom.balls[0].size * 7 , curRoom.balls[0].size * 7);
		}

	}

	function emitMovement() {
		if (moveUp && moveDown) {
			return;
		}
		else {
			socket!.emit("game", {
				id: GameEvents.MOVE,
				user: user,
				roomId: curRoom!.id,
				isPriv: curRoom!.isPriv,
				direction: moveUp ? Directions.UP : moveDown ? Directions.DOWN : Directions.STATIC,
			} as GamePacket);
		}
	}

	function handleMouseDown() {
		if (socket  && curRoom && user && !curRoom.isStart) {
			socket.emit("game", {
				id: GameEvents.START,
				user: user,
				roomId: curRoom!.id,
				isPriv: curRoom!.isPriv,
				direction: Directions.STATIC,
			} as GamePacket);
		}
	};

	function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (socket  && curRoom && user && curRoom.isStart) {
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
		if (socket && curRoom && user && curRoom.isStart) {
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

	function joinRoom() {
		if (!socket || !user)
			console.log("NO SOCKET OR USER !");
		else if (!curRoom && !waitForPlay) {
			socket!.emit("game", {
				id: GameEvents.JOINRAND,
				user: user,
			} as GamePacket);
		}
	}

	function createPrivRoom() {
		if (!socket || !user)
			console.log("NO SOCKET OR USER !");
		else if (!curRoom && !waitForPlay) {
			socket!.emit("game", {
				id: GameEvents.CREATEPRIV,
				user: user,
			} as GamePacket);
		}
	}

	function joinPrivRoom(e: React.KeyboardEvent<HTMLInputElement>) {
		const target: HTMLInputElement = e.currentTarget;
		if (!socket || !user)
			console.log("NO SOCKET OR USER !");
		else if (!curRoom && !waitForPlay && e.code === "Enter") {
			socket!.emit("game", {
				id: GameEvents.JOINPRIV,
				user: user,
				roomId: target ? target.value : -1,
				isPriv: true,
			} as GamePacket);
		}
	}

	function clearRoom() {
		if (socket && curRoom) {
			socket!.emit("game", {
				id: GameEvents.CLEAR,
				user: user,
				roomId: curRoom.id,
				isPriv: curRoom!.isPriv,
			} as GamePacket);
		}
	}

	socket?.off("retJoinRoom").on("retJoinRoom", function(ret: Room | null) {
		if (ret === null) {
			setWaitForPlay(true);
		}
		else {
			setCurRoom(ret);
			setWaitForPlay(false);
			//setShowCanvas(true);
			setShowGameResult(true);
			//draw();
		}
	})

	socket?.off("retStartRoom").on("retStartRoom", function(ret: Room | null) {
		if (ret === null) {
			
		}
		else {
			setCurRoom(ret);
			if (ret.isStart) {
				setCounter(3);
				canvas = canvasRef.current;
				canvas!.style.animationName = "appearCvs";
			}
		}
	})

	socket?.off("retRoomData").on("retRoomData", function(ret: Room | null) {
		if (ret === null)
			console.log("Problem in retRoomData");
		else {
			setCurRoom(ret);
			draw();
		}
	})
	
	socket?.off("retGameOver").on("retGameOver", function(ret: Room | null) {
		if (ret) {
			setCurRoom(ret);
			setCounter(8);
			canvas = canvasRef.current;
			canvas!.style.animationName = "hideCvs";

		}
	})
	
	socket?.off("retClearRoom").on("retClearRoom", function() {
		setCurRoom(null);
	})

	return (
		<div id="game" className="game">
		{(() => {
			if (!curRoom) {
				if (!waitForPlay) {
					return (
						<div className="buttonWindow">
							<button onMouseDown={() => joinRoom()}>Search Match</button>
							<button onMouseDown={() => createPrivRoom()}>Create private room</button>
							<input type="number" onKeyDown={joinPrivRoom} placeholder=" debug privRoom ID"/>
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
			if (curRoom) {
				return (
					<div onKeyDown={(e) => handleKeyDown(e)} onKeyUp={(e) => handleKeyUp(e)} onMouseDown={() => handleMouseDown()} tabIndex={-1}>
					{
						!curRoom.isOver ?
						<div className="roomInfo" >
							<div className="playerCard">
								<img className="playerAvatar" src={curRoom.p1.user.avatar} width="120px" alt=""></img>
								<div className="playerInfo">
									{curRoom.p1.user.login}
								</div>
								<div className="playerInfo">
									{curRoom.p2.user ? curRoom.p1.isReady ? curRoom.p2.isReady ? counter === 0 ? curRoom.p1.score : <div className="ready">Ready</div> : <div className="ready">Ready</div> : <div className="pressSpace">Click to start !</div> : <div className="pressSpace">room ID : {curRoom.id}</div>}
								</div>
							</div>
							<div className="versus">VS</div>
								<div className="playerCard">
								<img className="playerAvatar" src={curRoom.p2.user ? curRoom.p2.user.avatar : "https://t3.ftcdn.net/jpg/02/55/85/18/360_F_255851873_s0dXKtl0G9QHOeBvDCRs6mlj0GGQJwk2.jpg"} width="120px" alt=""></img>
								<div className="playerInfo">
									{curRoom.p2.user ? curRoom.p2.user.login : "invite a friend"}
								</div>
								<div className="playerInfo">
									{curRoom.p2.user ? curRoom.p2.isReady ? curRoom.p1.isReady ? counter === 0 ? curRoom.p2.score : <div className="ready">Ready</div> : <div className="ready">Ready</div> : <div className="pressSpace">Click to start ! </div> : <div className="pressSpace">wait...</div>}
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
						curRoom.isStart ?
						<div></div>
						:
						curRoom.isOver ?
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
