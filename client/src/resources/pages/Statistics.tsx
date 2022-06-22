import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { HistoryCard } from "../components/HistoryCard";

ChartJS.register(ArcElement, Tooltip, Legend);

export const Statistics = () => {
	const stats = useSelector((state: RootState) => state.stats)
	const users = useSelector((state: RootState) => state.users);

	const DoughnutData = {
		labels: ['Won', 'Lost'],
		datasets: [
		  {
			label: '# of Game played',
			data: [stats.matchWon, stats.nbMatchs - stats.matchWon],
			backgroundColor: [
			  'rgba(153, 102, 255, 0.2)',
			  'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
			  'rgba(153, 102, 255, 1)',
			  'rgba(255, 159, 64, 1)',
			],
			borderWidth: 1,
		  },
		],
	  };

	//const debugWin = () => {
	//	socket?.emit("stats", new PacketPlayOutStatsUpdate(1, 1, 2));
	//	socket?.emit("stats", new PacketPlayOutStatsUpdate(1, 2, 1));
	//}
//
	//const debugLose = () => {
	//	socket?.emit("stats", new PacketPlayOutStatsUpdate(2, 1, 2));
	//	socket?.emit("stats", new PacketPlayOutStatsUpdate(2, 2, 1));
	//}

let i = 0;
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
		i++;
		return (
			<HistoryCard key={i} date={date} opponent={opponent} result={result}/>
		)
		
	});

	return (
		<div className='statistics'>
			{/*<button type="submit" onClick={debugWin}>Win against user2</button>
			<button type="submit" onClick={debugLose}>Lose against user2</button>*/}
			<div className="figures">
				<p>Game played :<br/>{stats.nbMatchs}</p>
				<Doughnut data={DoughnutData}/>
		</div>
			<div className="history">
				<h4>Last Matches</h4>
				<table>
					<tbody>
						<tr className="titles">
							<th>
								<h4>Date</h4>
							</th>
							<th>
								<h4>Opponent</h4>
							</th>
							<th>
								<h4>Result</h4>
							</th>
						</tr>
						{listHistory}
					</tbody>
				</table>
			</div>
		</div>
	);
};
