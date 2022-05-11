import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { RootState } from "../../app/store";

interface Room {
	player1: string;
	p1Avatar: string;
	p1Up: boolean;
	p1Down: boolean;
	p1BasePos: number;
	p1Pos: number;
	player2: string;
	p2Avatar: string;
	p2Up: boolean;
	p2Down: boolean;
	p2BasePos: number;
	p2Pos: number;
	BallY: number;
	isFull: boolean;
	usrsSocket: Map<any, any>;
}

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
			if (e.key === 'w' && curRoom.player1 === user.login && curRoom.p1Pos > curRoom.p1BasePos - 245) {
				p1Up = true;
				p1Down = false;
			}
			if (e.key === 's' && curRoom.player1 === user.login && curRoom.p1Pos < curRoom.p1BasePos + 240) {
				p1Up = false;
				p1Down = true;
			}
			if (e.key === 'w' && curRoom.player2 === user.login && curRoom.p2Pos > curRoom.p2BasePos - 245) {
				p2Up = true;
				p2Down = false;
			}
			if (e.key === 's' && curRoom.player2 === user.login && curRoom.p2Pos < curRoom.p2BasePos + 240) {
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
			if (e.key === 'w' && curRoom.player1 === user.login) {
				p1Up = false;
			}
			if (e.key === 's' && curRoom.player1 === user.login) {
				p1Down = false;
			}
			if (e.key === 'w' && curRoom.player2 === user.login) {
				p2Up = false;
			}
			if (e.key === 's' && curRoom.player2 === user.login) {
				p2Down = false;
			}
		}

	};

	function emitMovement() {
		if(socket && gameLaunch) {
			if (p1Up || p1Down || p2Up || p2Down) {
				socket.emit('playerMove', {name: user?.login, p1Up: p1Up, p1Down: p1Down, p2Up: p2Up, p2Down: p2Down});
			}
		}
		//requestAnimationFrame(emitMovement);
	}

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
		else {
			socket.emit('joinRoom', {name: user?.login, avatar: user?.avatar});
		}
	}

	socket?.off("retPlayerMove").on("retPlayerMove", function(ret: Room | null) {
		if (ret === null)
			console.log("Problem in retPlayerMove");
		else {
			setCurRoom(ret);
			if (p1 && p2) {
				p1.style.top =  curRoom?.p1Pos + "px";
				p2.style.top =  curRoom?.p2Pos + "px";
			}
			else {
				p1 = document.getElementById('paddle_1');
				p2 = document.getElementById('paddle_2');
			}
		}
	})


	socket?.off("retClearRoom").on("retClearRoom", function(ret: number) {
		if (ret === 1)
			console.log("Your not in room");
		else {
			gameLaunch = false;
			setPressEnter("Press Enter to Play Pong");
			setCurRoom(null);
		}
	})

	function clearRoom() {
		socket?.emit('clearRoom', {name: user?.login});
	}

	function initGame() {
		p1 = document.getElementById('paddle_1');
		p2 = document.getElementById('paddle_2');

		if (p1 && p2) {
			document.removeEventListener('keydown', e => {handleKeyDown(e)});
			document.removeEventListener('keyup', e => {handleKeyUp(e)});
			document.addEventListener('keydown', e => {handleKeyDown(e)});
			document.addEventListener('keyup', e => {handleKeyUp(e)});
			setInterval(emitMovement, 100);
			p1.style.top =  curRoom?.p1Pos + "px";
			p2.style.top =  curRoom?.p2Pos + "px";
			gameLaunch = true;
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
						<img className="playerAvatar" src={curRoom.p1Avatar} width="120px" alt=""></img>
						<div className="playerInfo">
							{curRoom.player1}
						</div>
					</div>
					<div className="versus">VS</div>
					<div className="playerCard">
						<img className="playerAvatar" src={curRoom.p2Avatar} width="120px" alt=""></img>
						<div className="playerInfo">
							<div> {curRoom.player2} </div>
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
