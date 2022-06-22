import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { HistoryCard } from "../components/HistoryCard";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { setProfile } from "../../app/slices/profileSlice";

ChartJS.register(ArcElement, Tooltip, Legend);

export const Profile = () => {
	
	const stats = useSelector((state: RootState) => state.profile);
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
	const ref = useRef<HTMLInputElement>(null);

	const handleClose = () => {
		dispatch(setProfile({
			nbMatchs: 0,
			matchWon: 0,
			history: [],
			user: undefined,
		}));
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				handleClose();
			}
		};
		document.addEventListener('mousedown', handleClickOutside, true);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside, true);
		};
	}, [ref])

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
		if (h.player1.name === stats.user?.name)
			opponent = h.player2.name;
		else
			opponent = h.player1.name;
		let result: string;
		if (h.winner === stats.user?.id)
			result = "won";
		else 
			result = "lost";
		return (
			<HistoryCard key={i++} date={date} opponent={opponent} result={result}/>
		)
	});

	if (stats.user) {
		return (
			<div  className="popup-box">
				<div ref={ref} className="box">
					<span className="close-icon" onClick={handleClose}>x</span>
					<div className='profile'>
						<div className="stats">
							<div className="player">
								<div className="avatar">
									<img src={stats.user?.avatar}width="75px" height="75px" alt=""></img>
								</div>
								<div className="infos">
									<p>{stats.user?.name}</p>
									<p>{stats.user?.login}</p>
									<p>Level {stats.user ? Math.floor(stats.user.xp / 100) : 0}</p>
									<p>Progress for next level : {stats.user ? stats.user.xp % 100 : 0} %</p>
								</div>
							</div>
							<div className="graph">
								<p>Game played :<br/>{stats.nbMatchs}</p>
								<Doughnut data={DoughnutData}/>
							</div>
						</div>
						<div className="history">
							<h4>Last Matches</h4>
							<table>
								<tbody>
									<tr className="titles">
										<td>
											<h4>Date</h4>
										</td>
										<td>
											<h4>Opponent</h4>
										</td>
										<td>
											<h4>Result</h4>
										</td>
									</tr>
									{listHistory}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	}
	else
		return(<></>)
}

