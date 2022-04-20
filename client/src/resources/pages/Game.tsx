import { useEffect } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { RootState } from "../../app/store";

interface Room {
	player1: string;
	p1PaddleX: number;
	player2: string;
	p2PaddleX: number;
	BallY: number;
}

export const Game = () => {
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);

	useEffect(() => {
		
	}, []);

	socket.off("retJoinRoom").on("retJoinRoom", function(ret: Room | null) {
		if (ret === null)
			console.log("Cannot join room");
		else
			console.log(ret);
	})

	function joinRoom() {
		if (!socket || !user)
			console.log("NO SOCKET OR USER !");
		else
		{
			console.log("Clique !");
			socket.emit('joinRoom', {name: user?.login});
		}
	}

	function clearRoom() {
		socket.emit('clearRoom', {name: user?.login});
	}

	return (
		<div id="game" className="game">
			<div className="buttonWindow">
				<button onMouseDown={() => joinRoom()}>Join room</button>
				<button onMouseDown={() => clearRoom()}>Clear room</button>
			</div>
			<div className="gameWindow">

			</div>
		</div>
	);
};
