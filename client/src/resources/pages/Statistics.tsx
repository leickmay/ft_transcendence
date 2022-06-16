import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { PacketPlayOutStatsUpdate } from "../../app/packets/PacketPlayOutStatsUpdate";
import { RootState } from "../../app/store";
import { Doughnut } from 'react-chartjs-2';
//import { DoughnutData } from "../components/DoughnutData";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Statistics = () => {
	const socket = useContext(SocketContext);
	const stats = useSelector((state: RootState) => state.stats)
	const users = useSelector((state: RootState) => state.users);
	//const [reloadVar, setReloadVar] = useState(0);

	//useEffect(() => {
	//	setReloadVar(value => value + 1);
	//}, [stats])

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

	const debugWin = () => {
		socket?.emit("stats", new PacketPlayOutStatsUpdate(1, 1, 2, users.current!.id));
		socket?.emit("stats", new PacketPlayOutStatsUpdate(1, 2, 1, users.current!.id));
	}

	const debugLose = () => {
		socket?.emit("stats", new PacketPlayOutStatsUpdate(2, 1, 2,users.current!.id));
		socket?.emit("stats", new PacketPlayOutStatsUpdate(2, 2, 1,users.current!.id));
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
			<button type="submit" onClick={debugWin}>Win against user2</button>
			<button type="submit" onClick={debugLose}>Lose against user2</button>
			<div className="figures">
				<p>Game played :<br/>{stats.nbMatchs}</p>
				<Doughnut data={DoughnutData}/>
			</div>
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
