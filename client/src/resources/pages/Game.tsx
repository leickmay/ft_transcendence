import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { RootState } from "../../app/store";

interface Room {
	player1: string;
	p1Avatar: string;
	p1Up: false;
	p1Down: false;
	player2: string;
	p2Avatar: string;
	p2Up: false;
	p2Down: false;
	BallY: number;
	isFull: boolean;
}

let roomTmp: Room | null = null;

export const Game = () => {
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);
	const [curRoom, setCurRoom] = useState<Room | null>(roomTmp);
	let curRoom2: Room | null = null;

	let p1 = document.getElementById('paddle_1');
	let p1BasePos = 225;
	let p1Pos = p1BasePos;
	let p1Up: boolean = false;
	let p1Down: boolean = false;
	let p2 = document.getElementById('paddle_2');
	let p2BasePos = 125;
	let p2Pos = p2BasePos;
	let p2Up: boolean = false;
	let p2Down: boolean = false;
	let pSpeed = 8;
	let ball = document.getElementById('ball');

	let gameLaunch = false;
	const [pressEnter, setPressEnter] = useState("Press Enter to Play Pong");
	console.log("repasse");
	

	useEffect(() => {
		initGame();
		performMove();
	}, [curRoom?.isFull]);

	function handleKeyDown(e: any) {
		//console.log("curRoom : ", curRoom?.player1, " user.login", user?.login);
		if (socket && curRoom && user) {
			//console.log("hub");
			if (e.key === 'w' && curRoom.player1 === user.login && !p1Up) {
				//console.log("up true");
				//p1Up = true;
				//p1Down = false;
				socket.emit('p1', {name: user?.login, p1Up: true, p1Down: false});
			}
			if (e.key === 's' && curRoom.player1 === user.login && !p1Down) {
				//console.log("down true");
				//p1Up = false;
				//p1Down = true;
				socket.emit('p1', {name: user?.login, p1Up: false, p1Down: true});
			}
			if (e.key === 'w' && curRoom.player2 === user.login && !p2Up) {
				//console.log("up true");
				//p2Up = true;
				//p2Down = false;
				socket.emit('p2', {name: user?.login, p2Up: true, p2Down: false});
			}
			if (e.key === 's' && curRoom.player2 === user.login && !p2Down) {
				//console.log("down true");
				//p2Up = false;
				//p2Down = true;
				socket.emit('p2', {name: user?.login, p2Up: false, p2Down: true});
			}
		}
		//if (e.key === "Enter") {
		//	initGame();		
		//	gameLaunch = true;
		//	setPressEnter("");
		//}
	};

	function handleKeyUp(e: any) {
		//console.log("Handle Key Up...");
		if (socket && curRoom && roomTmp && user) {
			if (e.key === 'w' && curRoom.player1 === user.login) {
				//console.log("up false");
				//p1Up = false;
				roomTmp.p1Up = false;
				socket.emit('p1', {name: user?.login, p1Up: false, p1Down: false});
			}
			if (e.key === 's' && curRoom.player1 === user.login) {
				//console.log("down false");
				//p1Down = false;
				roomTmp.p1Down = false;
				socket.emit('p1', {name: user?.login, p1Up: false, p1Down: false});
			}
			if (e.key === 'w' && curRoom.player2 === user.login) {
				//console.log("up false");
				//p2Up = false;
				roomTmp.p2Up = false;
				socket.emit('p2', {name: user?.login, p2Up: false, p2Down: false});
			}
			if (e.key === 's' && curRoom.player2 === user.login) {
				//console.log("down false");
				//p2Down = false;
				roomTmp.p2Down = false;
				socket.emit('p2', {name: user?.login, p2Up: false, p2Down: false});
			}
		}

	};

	function performMove() {
		if (p1 && p2) {
			//console.log("check input...\n", p1Up, " ", p1Down);
			if (roomTmp?.p1Up && p1Pos > p1BasePos - 245) {
				p1Pos -= pSpeed;
				p1.style.top = p1Pos + "px";
				//console.log("p1 UP !");
			}
			else if (roomTmp?.p1Down && p1Pos < p1BasePos + 240) {
				p1Pos += pSpeed;
				p1.style.top = p1Pos + "px";
				//console.log("p1 DOWN !");
			}
			if (roomTmp?.p2Up && p2Pos > p2BasePos - 245) {
				p2Pos -= pSpeed;
				p2.style.top = p2Pos + "px";
				//console.log("p1 UP !");
			}
			else if (roomTmp?.p2Down && p2Pos < p2BasePos + 240) {
				p2Pos += pSpeed;
				p2.style.top = p2Pos + "px";
				//console.log("p1 DOWN !");
			}
		}
		else {
			p1 = document.getElementById('paddle_1');
			p2 = document.getElementById('paddle_2');
		}
		requestAnimationFrame(performMove);
	}

	//setInterval(performMove, 500);
	//performMove();

	socket?.off("retJoinRoom").on("retJoinRoom", function(ret: Room | null) {
		if (ret === null)
			console.log("Cannot join room");
		else {
			gameLaunch = true;
			setCurRoom(ret);
			roomTmp = ret;
			setPressEnter("");
			//p1Up = ret.p1Up;
			//p1Down = ret.p1Down;
			//console.log("MAJ up: ", p1Up, " down: ", p1Down);
		}
	})

	function joinRoom() {
		if (!socket || !user)
			console.log("NO SOCKET OR USER !");
		else {
			//console.log("Clique !");
			socket.emit('joinRoom', {name: user?.login, avatar: user?.avatar});
		}
	}

	socket?.off("retClearRoom").on("retClearRoom", function(ret: number) {
		if (ret === 1)
			console.log("Your not in room");
		else {
			gameLaunch = false;
			setPressEnter("Press Enter to Play Pong");
			setCurRoom(null);
			roomTmp = null;
		}
	})

	function clearRoom() {
		socket?.emit('clearRoom', {name: user?.login});
	}

	function initGame() {
		//console.log("init Game");
		p1 = document.getElementById('paddle_1');
		p2 = document.getElementById('paddle_2');

		if (p1 && p2) {
			console.log("Refresh Game");
			document.removeEventListener('keydown', e => {handleKeyDown(e)});
			document.removeEventListener('keyup', e => {handleKeyUp(e)});
			document.addEventListener('keydown', e => {handleKeyDown(e)});
			document.addEventListener('keyup', e => {handleKeyUp(e)});
			p1.style.top = p1BasePos + "px";
			p2.style.top = p2BasePos + "px";
			p1Pos = p1BasePos;
			p2Pos = p2BasePos;
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
