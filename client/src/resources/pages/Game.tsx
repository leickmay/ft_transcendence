import React, { useEffect, useState, useRef } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { RootState } from "../../app/store";
import { Directions, GameEvents, GamePacket, Room } from "../../app/interfaces/Game.interface"
import { User } from "../../app/interfaces/User";

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

export const Game = () => {
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);
	const [curRoom, setCurRoom] = useState<Room | null>();
	
	let moveUp: boolean = false;
	let moveDown: boolean = false;
	
	let gameLaunch = false;
	const [pressEnter, setPressEnter] = useState("Press Enter to Play Pong");
	
	let canvasRef = useRef<HTMLCanvasElement>(null)
	
	useEffect(() => {
		if (curRoom?.isFull) {
			initGame();
		}
	}, [curRoom?.isFull]);
	
	const draw = () => {
		emitMovement();
		if (ctx && curRoom) {
			console.log("draw:\n p1y: ", curRoom.p1.y , "\np2y: ", curRoom.p2.y );
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, curRoom.height, curRoom.width);
			ctx.fillStyle = "purple";
			ctx.fillRect(curRoom.p1.x , curRoom.p1.y , curRoom.p1.width , curRoom.p1.height);
			ctx.fillRect(curRoom.p2.x , curRoom.p2.y , curRoom.p2.width , curRoom.p2.height);
		} 
		window.requestAnimationFrame(draw);
	}

	function handleKeyDown(e: any) {
		if (socket  && curRoom && user) {
			if (e.key === 'w') {
				moveUp = true;
				moveDown = false;
			}
			if (e.key === 's') {
				moveUp = false;
				moveDown = true;
			}
		}
		//if (e.key === "Enter") {
		//	initGame();		
		//	gameLaunch = true;
		//	setPressEnter("");
		//}
	};

	function handleKeyUp(e: any) {
		if (socket && curRoom && user) {
			if (e.key === 'w') {
				moveUp = false;
			}
			if (e.key === 's') {
				moveDown = false;
			}
		}
		
	};

	function joinRoom() {
		if (!socket || !user)
			console.log("NO SOCKET OR USER !");
		else if (!curRoom) {
			socket!.emit("game", {
				id: GameEvents.JOIN,
				user: user,
			} as GamePacket);
		}
	}

	socket?.off("retJoinRoom").on("retJoinRoom", function(ret: Room | null) {
		if (ret === null)
			console.log("Cannot join room");
		else {
			setCurRoom(ret);
			setPressEnter("");
		}
	})

	function emitMovement() {
		let direction: Directions | undefined;
		if (curRoom) {
			if (moveUp && moveDown) {
				return;
			}
			if (moveUp) direction = Directions.UP;
			if (moveDown) direction = Directions.DOWN;
			if (direction) {
				socket!.emit("game", {
					id: GameEvents.MOVE,
					user: user,
					roomId: curRoom.id,
					direction: direction,
				} as GamePacket);
			}
		}
	}

	socket?.off("retPlayerMove").on("retPlayerMove", function(ret: Room | null) {
		if (ret === null)
			console.log("Problem in retPlayerMove");
		else {
			setCurRoom(ret);
		}
	})

	//socket?.off("retBallMove").on("retBallMove", function(ret: Room | null) {
	//	setCurRoom1(ret);
	//	if (curRoom1 && ball) {
	//		ball.style.top = curRoom1.balls[0].y + "px";
	//		ball.style.left = curRoom1.balls[0].x + "px";
	//	}
	//	else {
	//		ball = document.getElementById('ball');
	//	}
	//})


	socket?.off("retClearRoom").on("retClearRoom", function(ret: number) {
		gameLaunch = false;
		setPressEnter("Press Enter to Play Pong");
		setCurRoom(null);
	})

	function clearRoom() {
		if (socket && curRoom) {
			socket.emit('clearRoom', {id: curRoom.id});
		}
	}

	function initGame() {
		if (curRoom) {
			canvas = canvasRef.current;
			if (!canvas)
				return ;
			ctx = canvas!.getContext('2d');
		}
		
		if (curRoom && curRoom.isFull) {
			document.removeEventListener('keydown', e => {handleKeyDown(e)});
			document.removeEventListener('keyup', e => {handleKeyUp(e)});
			document.addEventListener('keydown', e => {handleKeyDown(e)});
			document.addEventListener('keyup', e => {handleKeyUp(e)});
			
			window.requestAnimationFrame(draw);
		}
	}

	return (
		<div id="game" className="game">
			<div className="buttonWindow">
				<button onMouseDown={() => joinRoom()}>Join room</button>
				<button onMouseDown={() => clearRoom()}>Clear room</button>
			</div>
			{ 
				curRoom ?
				<div>
					<div className="roomInfo">
						<div className="playerCard">
							<img className="playerAvatar" src={curRoom.p1.user.avatar} width="120px" alt=""></img>
							<div className="playerInfo">
								{curRoom.p1.user.name}
							</div>
						</div>
						<div className="versus">VS</div>
						<div className="playerCard">
							<img className="playerAvatar" src={curRoom.p2.user ? curRoom.p2.user.avatar : "https://t3.ftcdn.net/jpg/02/55/85/18/360_F_255851873_s0dXKtl0G9QHOeBvDCRs6mlj0GGQJwk2.jpg"} width="120px" alt=""></img>
							<div className="playerInfo">
								<div> {curRoom.p2.user ? curRoom.p2.user.name : "search ..."} </div>
							</div>
						</div>
					</div>
				</div>
				:
				<div>You are not in a room</div>
			}
			{
				curRoom && curRoom.isFull ?
				<canvas ref={canvasRef} height={curRoom.height} width={curRoom.width} />
				:
				<div>Room is not Full</div>
		}
		</div>
	);
};
