import React, { useEffect, useState, useRef } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { RootState } from "../../app/store";
import { Directions, GameEvents, GamePacket, Room } from "../../app/interfaces/Game.interface"

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

export const Game = () => {
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);
	const [curRoom, setCurRoom] = useState<Room | null>();
	const [counter, setCounter] = useState<number>(0);
	let p1IsReady: boolean = false;
	let p2IsReady: boolean = false;
	let isStart: boolean = false;
	let isOver: boolean = false;
	
	let moveUp: boolean = false;
	let moveDown: boolean = false;
	
	const [waitForPlay, setWaitForPlay] = useState(false);
	
	let canvasRef = useRef<HTMLCanvasElement>(null)
	
	useEffect(() => {
		if (curRoom?.isFull) {
			initGame();
		}
	}, [curRoom?.isFull]);

	useEffect(() => {
		counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
		if (counter === 1) {
			clearRoom();
			setCounter(0);
		}
	}, [counter]);
	
	function initGame() {
			canvas = canvasRef.current;
			if (!canvas)
				return ;
			ctx = canvas!.getContext('2d');
			document.removeEventListener('keydown', e => {handleKeyDown(e)});
			document.removeEventListener('keyup', e => {handleKeyUp(e)});
			document.addEventListener('keydown', e => {handleKeyDown(e)});
			document.addEventListener('keyup', e => {handleKeyUp(e)});

			draw();
		}

	const draw = () => {
		if (ctx && curRoom) {
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, curRoom.width, curRoom.height);
			if (isStart && !isOver) {
				ctx.fillStyle = "pink";
				ctx.fillRect(curRoom.p1.x , curRoom.p1.y , curRoom.p1.width * 1.3 , curRoom.p1.height * 1.05);
				ctx.fillRect(curRoom.p2.x * 0.9965 , curRoom.p2.y , curRoom.p2.width * 1.3 , curRoom.p2.height * 1.05);
				ctx.fillStyle = "purple";
				ctx.fillRect(curRoom.p1.x , curRoom.p1.y , curRoom.p1.width , curRoom.p1.height);
				ctx.fillRect(curRoom.p2.x , curRoom.p2.y , curRoom.p2.width , curRoom.p2.height);
				ctx.fillStyle = "pink";
				ctx.beginPath();
				ctx.arc(curRoom.balls[0].x, curRoom.balls[0].y, curRoom.balls[0].size, 0, Math.PI*2);
				ctx.fill();
			}
			if (!isStart) {
				ctx.font = "50px Arial";
				ctx.fillStyle = "purple";
				if(!p1IsReady) {
					ctx.fillText("Wait " + curRoom.p1.user.login + " for press space to start", curRoom.width / 3, curRoom.height / 2);
				}
				if (!p2IsReady) {
					ctx.fillText("Wait " + curRoom.p2.user.login + " for press space to start", curRoom.width / 3, curRoom.height / 1.8);
				}
			}
			if(isOver) {
				ctx.font = "50px Arial";
				ctx.fillStyle = "purple";
				ctx.fillText("THE WINNER IS: " + (curRoom.p1.score > curRoom.p2.score ? curRoom.p1.user.login : curRoom.p2.user.login) + ", quel incroyable BG du 69", curRoom.width / 4, curRoom.height / 2);
				ctx.fillText("leave in " + (counter - 1) + " seconds", curRoom.width / 2.5, curRoom.height / 1.8);
			}
		}

	}

	function emitMovement() {
		if (curRoom && isStart) {
			if ((moveUp && moveDown)) {
				return;
			}
			else {
				console.log("emit Move!");
				socket!.emit("game", {
					id: GameEvents.MOVE,
					user: user,
					roomId: curRoom!.id,
					direction: moveUp ? Directions.UP : moveDown ? Directions.DOWN : Directions.STATIC,
				} as GamePacket);
			}
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (socket  && curRoom && user) {
			if (e.key === 'w' && !moveUp) {
				moveUp = true;
				moveDown = false;
				emitMovement();
			}
			if (e.key === 's' && !moveDown) {
				moveUp = false;
				moveDown = true;
				emitMovement();
			}
		}
		if (socket && e.key === " " && curRoom && !isStart) {
			socket.emit("game", {
				id: GameEvents.START,
				roomId: curRoom.id,
				user: user,
			} as GamePacket);
		}
	};

	function handleKeyUp(e: KeyboardEvent) {
		if (socket && curRoom && user) {
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
				id: GameEvents.JOIN,
				user: user,
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
		}
	})

	socket?.off("retStartRoom").on("retStartRoom", function(ret: Room | null) {
		if (ret === null) {
			
		}
		else {
			setCurRoom(ret);
			p1IsReady = ret.p1.isReady;
			p2IsReady = ret.p2.isReady;
			isStart = ret.isStart;
			isOver = ret.isOver;
			if (ret.isStart) {
				document.removeEventListener('keydown', e => {handleKeyDown(e)});
				document.removeEventListener('keyup', e => {handleKeyUp(e)});
				document.addEventListener('keydown', e => {handleKeyDown(e)});
				document.addEventListener('keyup', e => {handleKeyUp(e)});
			}
			draw();
		}
	})

	socket?.off("retRoomData").on("retRoomData", function(ret: Room | null) {
		if (ret === null)
			console.log("Problem in retRoomData");
		else {
			//console.log("ret: ", ret);
			setCurRoom(ret);
			p1IsReady = ret.p1.isReady;
			p2IsReady = ret.p2.isReady;
			isStart = ret.isStart;
			isOver = ret.isOver;
			draw();
		}
	})

	function clearRoom() {
		if (socket && curRoom) {
			socket!.emit("game", {
				id: GameEvents.CLEAR,
				roomId: curRoom.id,
				user: user,
			} as GamePacket);
		}
	}

	socket?.off("retClearRoom").on("retClearRoom", function() {
		console.log("CLEAR!");
		setCurRoom(null);
		p1IsReady = false;
		p2IsReady = false;
		isStart = false;
		isOver = false;
	})

	socket?.off("retGameOver").on("retGameOver", function() {
		console.log("GameOver!");
		setCounter(11);
		isStart = false;
		isOver = true;
	})

	return (
		<div id="game" className="game">
			{
				curRoom || waitForPlay ?
				<div></div>
				:
				<div className="buttonWindow">
					<button onMouseDown={() => joinRoom()}>Join room</button>
					<button onMouseDown={() => clearRoom()}>Clear room</button>
				</div>
			}
			{ 
				curRoom ?
				<div>
					<div className="roomInfo">
						<div className="playerCard">
							<img className="playerAvatar" src={curRoom.p1.user.avatar} width="120px" alt=""></img>
							<div className="playerInfo">
								{curRoom.p1.user.login}
							</div>
							<div className="playerInfo">
								{curRoom.p1.score}
							</div>
						</div>
						<div className="versus">VS</div>
						<div className="playerCard">
							<img className="playerAvatar" src={curRoom.p2.user ? curRoom.p2.user.avatar : "https://t3.ftcdn.net/jpg/02/55/85/18/360_F_255851873_s0dXKtl0G9QHOeBvDCRs6mlj0GGQJwk2.jpg"} width="120px" alt=""></img>
							<div className="playerInfo">
								<div> {curRoom.p2.user.login} </div>
							</div>
							<div className="playerInfo">
								{curRoom.p2.score}
							</div>
						</div>
					</div>
				</div>
				:
				waitForPlay ?
				<div className="roomSearchMatch">
					<div>search matchmaking</div>
					<div className="spinner-grow" role="status"></div>
				</div>
				:
				<div></div>
			}
			{
				curRoom && curRoom.isFull ?

				<canvas ref={canvasRef} height={curRoom.height} width={curRoom.width}/>
				:
				<div></div>
			}
		</div>
	);
};
