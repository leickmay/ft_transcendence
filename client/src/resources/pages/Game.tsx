import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { RootState } from "../../app/store";
import { Room } from "../../app/interfaces/Game"

export const Game = () => {
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);
	const [curRoom, setCurRoom] = useState<Room | null>();

	let p1 = document.getElementById('paddle_1');
	let p1Up: boolean = false;
	let p1Down: boolean = false;
	let p2 = document.getElementById('paddle_2');
	let p2Up: boolean = false;
	let p2Down: boolean = false;
	let ball = document.getElementById('ball');

	let gameLaunch = false;
	const [pressEnter, setPressEnter] = useState("Press Enter to Play Pong");

	useEffect(() => {
		initGame();
	}, [curRoom?.isFull]);

	function handleKeyDown(e: any) {
		if (socket && curRoom && user) {
			if (e.key === 'w' && curRoom.p1.user.login === user.login && curRoom.p1.y > curRoom.p1.baseY - 245) {
				p1Up = true;
				p1Down = false;
			}
			if (e.key === 's' && curRoom.p1.user.login === user.login && curRoom.p1.y < curRoom.p1.baseY + 240) {
				p1Up = false;
				p1Down = true;
			}
			if (e.key === 'w' && curRoom.p2.user.login === user.login && curRoom.p2.y > curRoom.p2.baseY - 245) {
				p2Up = true;
				p2Down = false;
			}
			if (e.key === 's' && curRoom.p2.user.login === user.login && curRoom.p2.y < curRoom.p2.baseY + 240) {
				p2Up = false;
				p2Down = true;
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
			if (e.key === 'w' && curRoom.p1.user.login === user.login) {
				p1Up = false;
			}
			if (e.key === 's' && curRoom.p1.user.login === user.login) {
				p1Down = false;
			}
			if (e.key === 'w' && curRoom.p2.user.login === user.login) {
				p2Up = false;
			}
			if (e.key === 's' && curRoom.p2.user.login === user.login) {
				p2Down = false;
			}
		}

	};

	function emitMovement() {
		if(curRoom && socket && gameLaunch) {
			if (p1Up || p1Down || p2Up || p2Down) {
				socket.emit('playerMove', {id: curRoom.id, p1Up: p1Up, p1Down: p1Down, p2Up: p2Up, p2Down: p2Down});
			}
		}
		//requestAnimationFrame(emitMovement);
	}

	socket?.off("retPlayerMove").on("retPlayerMove", function(ret: Room | null) {
		if (ret === null)
			console.log("Problem in retPlayerMove");
		else {
			setCurRoom(ret);
			if (curRoom && p1 && p2) {
				console.log("ret Moove !");
				p1.style.top =  curRoom.p1.y + "px";
				p2.style.top =  curRoom.p2.y + "px";
			}
			else if (curRoom) {
				p1 = document.getElementById('paddle_1');
				p2 = document.getElementById('paddle_2');
			}
		}
	})

	socket?.off("retJoinRoom").on("retJoinRoom", function(ret: Room | null) {
		if (ret === null)
			console.log("Cannot join room");
		else {
			setCurRoom(ret);
			setPressEnter("");
		}
	})
	
	function joinRoom() {
		if (!socket || !user)
			console.log("NO SOCKET OR USER !");
		else if (!curRoom) {
			socket.emit('joinRoom', {user: user});
		}
	}



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
			p1 = document.getElementById('paddle_1');
			p2 = document.getElementById('paddle_2');
		}

		if (curRoom && p1 && p2) {
			document.removeEventListener('keydown', e => {handleKeyDown(e)});
			document.removeEventListener('keyup', e => {handleKeyUp(e)});
			document.addEventListener('keydown', e => {handleKeyDown(e)});
			document.addEventListener('keyup', e => {handleKeyUp(e)});
			p1.style.top =  curRoom.p1.baseY + "px";
			p2.style.top =  curRoom.p2.baseY + "px";
			gameLaunch = true;
			setInterval(emitMovement, 50);
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
				:
				<div>You are not in a room</div>
			}
			{
				curRoom && curRoom.isFull ?
				<div className="gameWindow">
					<div id="ball" className='ball'>
						<div className="ball_effect"></div>
					</div>
					<div id="paddle_1" className="paddle_1 paddle"></div>
					<div id="paddle_2" className="paddle_2 paddle"></div>
					<h1 className="message">
						{/*pressEnter*/}
					</h1>
				</div>
				:
				<div>Room is not Full</div>
			}
		</div>
	);
};
