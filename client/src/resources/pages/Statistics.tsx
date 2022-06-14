import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { PacketPlayOutStatsUpdate } from "../../app/packets/PacketPlayOutStatsUpdate";
import { RootState } from "../../app/store";

export const Statistics = () => {
	const socket = useContext(SocketContext);
	const stats = useSelector((state: RootState) => state.stats)
	const users = useSelector((state: RootState) => state.users);
	const [ReloadVar,setReloadVar] = useState(0);

	useEffect(() => {
		setReloadVar(ReloadVar + 1);
	}, [stats])

	const debugWin = () => {
		socket?.emit("stats", new PacketPlayOutStatsUpdate(1, 1, 2, users.current!.id));
	}

	const debugLose = () => {
		socket?.emit("stats", new PacketPlayOutStatsUpdate(2, 2, 1,users.current!.id));
	}


	const listHistory = stats.history.map((h) => {
		const date = new Date(h.createdDate);
		let opponent: string;
		if (h.p1.name === users.current!.name)
			opponent = h.p2.name;
		else
			opponent = h.p1.name;
		let result: string;
		if (h.winnerId === users.current!.id)
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
			<button type="submit" onClick={debugWin}>Win against user2</button>
			<button type="submit" onClick={debugLose}>Lose against user2</button>
	
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
