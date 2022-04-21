import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { RootState } from "../../app/store";

interface Room {
	player1: string;
	p1Avatar: string;
	p1PaddleX: number;
	player2: string;
	p2Avatar: string;
	p2PaddleX: number;
	BallY: number;
	isFull: boolean;
}

export const Game = () => {
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);
	const [curRoom, setCurRoom] = useState<Room | null>(null);

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

	useEffect(() => {
		document.addEventListener('keydown', e => {handleKeyDown(e)});
		document.addEventListener('keyup', e => {handleKeyUp(e)});
	}, []);

	function handleKeyDown(e: any) {
		//console.log("Handle Key Down...", e.key);
		if (e.key === 'w') {
			p1Up = true;
			p1Down = false;
		}
		if (e.key === 's') {
			p1Up = false;
			p1Down = true;
		}
		if (e.key === 'ArrowUp') {

		}
		if (e.key === 'ArrowDown') {

		}
		if (e.key === "Enter") {
			initGame();		
			gameLaunch = true;
			setPressEnter("");
		}
	};

	function handleKeyUp(e: any) {
		//console.log("Handle Key Up...");
		if (e.key === 'w') {
			p1Up = false;
		}
		if (e.key === 's') {
			p1Down = false;
		}
		if (e.key === 'ArrowUp') {

		}
		if (e.key === 'ArrowDown') {

		}
	};

	function performMove() {
		if (p1 && p2)
		{
			//console.log("check input...");
			if (p1Up === true && p1Pos > p1BasePos - 245) {
				p1Pos -= pSpeed;
				p1.style.top = p1Pos + "px";
			}
			if (p1Down === true && p1Pos < p1BasePos + 240) {
				p1Pos += pSpeed;
				p1.style.top = p1Pos + "px";
			}
			if (p2Up) {
				
			}
			if (p2Down) {
				
			}
		}
	}

	setInterval(performMove, 50);

	socket?.off("retJoinRoom").on("retJoinRoom", function(ret: Room | null) {
		if (ret === null)
			console.log("Cannot join room");
		else
		{
			setCurRoom(ret);
		}
	})

	function joinRoom() {
		if (!socket || !user)
			console.log("NO SOCKET OR USER !");
		else
		{
			console.log("Clique !");
			socket.emit('joinRoom', {name: user?.login, avatar: user?.avatar});
		}
	}

	socket?.off("retClearRoom").on("retClearRoom", function(ret: number) {
		if (ret === 1)
			console.log("Your not in room");
		else
		{
			gameLaunch = false;
			setPressEnter("Press Enter to Play Pong");
			setCurRoom(null);
		}
	})

	function clearRoom() {
		socket?.emit('clearRoom', {name: user?.login});
	}

	function initGame() {
		if (p1 && p2)
		{
			console.log("Refresh Game");
			p1.style.top = p1BasePos + "px";
			p2.style.top = p2BasePos + "px";
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
						{pressEnter}
					</h1>
				</div>
				:
				<div>Room is not Full</div>
			}
		</div>
	);
};
