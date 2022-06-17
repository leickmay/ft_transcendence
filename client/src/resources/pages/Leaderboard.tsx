import { useCallback, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { PacketPlayOutLeaderboard } from "../../app/packets/PacketPlayOutLeaderboard";
import { RootState } from "../../app/store";
import { BoardCard } from "../components/BoardCard";

export const Leaderboard = () => {
	const board = useSelector((state: RootState) => state.board);
	const socket = useContext(SocketContext);

	useEffect(() => {
		socket?.emit('stats', new PacketPlayOutLeaderboard('won'));
	}, [socket]);

	const list = board.map((u) => {
		return (
			<BoardCard key={u.login} user={u} />
		)
	})

	const request = useCallback((field: 'played' | 'won' | 'level') => {
		socket?.emit('stats', new PacketPlayOutLeaderboard(field));
	}, [socket]);

	return (
		<table id="leaderboard">
			<tbody>
				<tr className="titles">
					<th>
						<h4>Player</h4>
					</th>
					<th>
						<button onClick={() => request('played')}>Match Played</button>
					</th>
					<th>
						<button onClick={() => request('won')}>Match Won</button>
					</th>
					<th>
						<button onClick={() => request('level')}>Level</button>
					</th>
				</tr>
				{list}
			</tbody>
		</table>
	);
};
