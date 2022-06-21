import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { RootState } from "../../app/store";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { HistoryCard } from "../components/HistoryCard";
import { PacketPlayOutProfile } from "../../app/packets/PacketPlayOutProfile";


ChartJS.register(ArcElement, Tooltip, Legend);

export const Profile = () => {
	const socket = useContext(SocketContext);
	const users = useSelector((state: RootState) => state.users);
	const stats = useSelector((state: RootState) => state.profile);
	const [player, setPlayer] = useState('');

	useEffect(() => {
		const str: string[] = window.location.href.split('=');
		setPlayer(str[1]);
		if (player)
			socket?.emit('stats', new PacketPlayOutProfile(player));
		console.log(stats);
	}, [player])

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
		return (
			<HistoryCard key={i++} date={date} opponent={opponent} result={result}/>
		)
		
	});

	return (
		<div className='statistics'>
			<img src={stats.user?.avatar}width="75px" height="75px" alt=""></img>
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
