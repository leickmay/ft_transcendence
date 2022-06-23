import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useCallback, useContext, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/SocketContext';
import { PacketPlayOutStatsRequest } from '../../app/packets/PacketPlayOutStatsRequest';
import { RootState } from '../../app/store';
import { History } from '../components/History';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Statistics = () => {
	const socket = useContext(SocketContext);
	const stats = useSelector((state: RootState) => state.stats);
	const users = useSelector((state: RootState) => state.users);

	const refresh = useCallback(() => {
		socket?.emit('stats', new PacketPlayOutStatsRequest());
	}, [socket]);

	useEffect(() => {
		refresh();
	}, [refresh]);

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

	return (
		<div className='statistics'>
			{/*<button type="submit" onClick={debugWin}>Win against user2</button>
			<button type="submit" onClick={debugLose}>Lose against user2</button>*/}
			<div className="figures">
				<p>Game played :<br />{stats.nbMatchs}</p>
				<Doughnut data={DoughnutData} />
			</div>
			<History />
		</div>
	);
};
