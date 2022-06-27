import { useCallback, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/SocketContext";
import { PacketPlayOutLeaderboard } from "../../app/packets/PacketPlayOutLeaderboard";
import { RootState } from "../../app/store";
import { BoardCard } from "../components/BoardCard";

export const Leaderboard = () => {
	const ready = useSelector((state: RootState) => state.socket.ready);
	const board = useSelector((state: RootState) => state.board);
	const socket = useContext(SocketContext);

	const list = board.map((u) => {
		return (
			<BoardCard key={u.login} user={u} />
		)
	})

	const request = useCallback((field: 'played' | 'won' | 'level') => {
		socket?.emit('stats', new PacketPlayOutLeaderboard(field));
	}, [socket]);

	useEffect(() => {
		request('level');
	}, [ready, socket, request]);

	return (
		<table id="leaderboard" className="container">
			<tbody>
				<tr className="titles">
					<th>
						<h4>Player</h4>
					</th>
					<th>
						<button className="button-selected" onClick={() => request('played')}>Match Played</button>
					</th>
					<th>
						<button className="button-selected"  onClick={() => request('won')}>Match Won</button>
					</th>
					<th>
						<button className="button-selected"  onClick={() => request('level')}>Level</button>
					</th>
				</tr>
				{list}
			</tbody>
		</table>
	);
};
