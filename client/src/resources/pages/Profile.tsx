import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useCallback, useMemo, useRef } from "react";
import { Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from "react-redux";
import { resetProfile } from "../../app/slices/profileSlice";
import { RootState } from "../../app/store";
import { History } from "../components/History";

ChartJS.register(ArcElement, Tooltip, Legend);

export const Profile = () => {
	const stats = useSelector((state: RootState) => state.profile);
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
	const ref = useRef<HTMLInputElement>(null);

	// let removeFriend = (): JSX.Element => {
	// 	return (<div onClick={() => socket?.emit('user', new PacketPlayOutFriends('remove', props.user.id))}>
	// 		<p className='pointer' style={{ fontSize: '1rem' }}>Retirer l'amis</p>
	// 	</div>);
	// }

	const handleClose = useCallback(() => {
		dispatch(resetProfile());
	}, [dispatch]);

	const graphData = useMemo(() => ({
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
	}), [stats]);

	if (stats.user) {
		return (
			<div id="profile" className="pointer overlay" onClick={handleClose}>
				<div ref={ref} className="box cursor" onClick={e => e.stopPropagation()}>
					<span className="close-icon pointer" onClick={handleClose}>╳</span>
					<div className='profile'>
						<div className="stats">
							<div className="player">
								<div className="avatar">
									<img src={stats.user?.avatar} width="75px" height="75px" alt=""></img>
								</div>
								<div className="infos">
									<p>{stats.user?.name}</p>
									<p>{stats.user?.login}</p>
									<p>Level {stats.user ? Math.floor(stats.user.xp / 100) : 0}</p>
									<p>Progress for next level : {stats.user ? stats.user.xp % 100 : 0} %</p>
								</div>
							</div>
							<div className="graph">
								<p>Game played :<br />{stats.nbMatchs}</p>
								<Doughnut data={graphData} />
							</div>
						</div>
						<History target={stats.user} history={stats.history} />
					</div>
				</div>
			</div>
		);
	}
	else
		return (<></>)
}

