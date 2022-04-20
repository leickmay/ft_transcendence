import { useEffect, useState } from "react";
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
}

export const Game = () => {
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);
	const [curRoom, setCurRoom] = useState<Room | null>(null);

	useEffect(() => {
		
	}, []);

	socket.off("retJoinRoom").on("retJoinRoom", function(ret: Room | null) {
		if (ret === null)
			console.log("Cannot join room");
		else
		{
			console.log(ret);
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

	function clearRoom() {
		socket.emit('clearRoom', {name: user?.login});
		setCurRoom(null);
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
					<div className="p1">
						<img src={curRoom.p1Avatar}></img>
						{curRoom.player1}
					</div>
					<div className="versus">VERSUS</div>
					<div className="p2">
						<img src={curRoom.p2Avatar}></img>
						<div> {curRoom.player2} </div>
					</div>
				</div>
				:
				 <div className="roomInfo">
					<div>No Room</div>
				</div> 
			}
			<div className="gameWindow">
			</div>
		</div>
	);
};
