import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/SocketContext";
import { PacketPlayOutStatsRequest } from "../../app/packets/PacketPlayOutStatsRequest";
import { RootState } from "../../app/store";

export const Statistics = () => {
	const socket = useContext(SocketContext);
	const stats = useSelector((state: RootState) => state.stats)
	const users = useSelector((state: RootState) => state.users);

	const refresh = () => {
		socket?.emit("stats", new PacketPlayOutStatsRequest());
	}

	const listHistory = stats.history.map((h) => {
		const date = new Date(h.createdDate);
		let opponent: string;
		if (h.player1.name === users.current!.name)
			opponent = h.player2.name;
		else
			opponent = h.player1.name;
		let result: string;
		if (h.winner === users.current!.id)
			result = "won";
		else 
			result = "lost";
		return (
		<tr >
				<td>{date.toLocaleString()}</td>
				<td>{opponent}</td>
				<td>{result}</td>
		</tr>
		);
		
	});

	return (
		<div className='statistics'>
			<button type="submit" onClick={refresh}>Refresh</button>
	
			{<div className="figures">
				<p>Game played :<br/>{stats.nbMatchs}</p>
				<p>Game won :<br/>{stats.matchWon}</p>
				<p>Game lost :<br/>{stats.nbMatchs - stats.matchWon}</p>
				<p>Win ratio :<br/>{Math.floor(stats.matchWon / stats.nbMatchs * 100)} %</p>
	</div>}
			<div className="history">
				<h3>Last Matches</h3>
				<table>
					<tr>
						<th>Date</th>
						<th>Opponent</th>
						<th>Result</th>
					</tr>
					{listHistory}
				</table>
			</div>
		</div>
	);
};
