import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useCallback, useContext, useMemo, useRef } from "react";
import { Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../app/context/SocketContext";
import { GameStatus } from "../../app/interfaces/Game.interface";
import { PacketPlayOutPlayerInvite } from "../../app/packets/PacketPlayOutPlayerInvite";
import { InvitationStates, setInvitation, setInvitationStatus, setInvitationTarget } from "../../app/slices/profileSlice";
import { resetProfile } from "../../app/slices/profileSlice";
import { RootState } from "../../app/store";
import { History } from "../components/History";

ChartJS.register(ArcElement, Tooltip, Legend);

export const Profile = () => {
	const socket = useContext(SocketContext);

	const profile = useSelector((state: RootState) => state.profile);
	const game = useSelector((state: RootState) => state.game);
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
	const ref = useRef<HTMLInputElement>(null);
	const invitation = useSelector((state: RootState) => state.profile.invitation);
	const online = useSelector((state: RootState) => state.users.online);

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
				data: [profile.matchWon, profile.nbMatchs - profile.matchWon],
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
	}), [profile]);


	const sendInvitation = () => {
		let target = profile.user?.id;
		if (!target)
			return;
		socket?.emit('game', new PacketPlayOutPlayerInvite(target));
		console.log(profile.user?.id || -1)
		dispatch(setInvitationTarget(profile.user?.id || -1));
	}

	const getButtonGameInvitation = () => {
		console.log(invitation.status)
		if (!online.find(x => x.id === profile.user?.id))
			return <></>;
		switch (invitation.status) {
			case InvitationStates.NO_INVITATION: {
				if (game.status === GameStatus.WAITING)
					return <button onClick={sendInvitation}>Custom game invitation</button>
				else
					return <button onClick={sendInvitation}>Classic game invitation</button>
			}
			case InvitationStates.PENDING_INVITATION: {
				if (profile.user?.id === invitation.target)
					return <button>Invited</button>;
				break;
			}
			case InvitationStates.IN_GAME: {
				if (profile.user?.id === invitation.target)
					return <button>Invited</button>
				break;
			}
			default:
				return <></>;
		}
	}

	if (profile.user) {
		return (
			<div id="profile" className="pointer overlay" onClick={handleClose}>
				<div ref={ref} className="box cursor" onClick={e => e.stopPropagation()}>
					<span className="close-icon pointer" onClick={handleClose}>╳</span>
					<div className='profile'>
						<div className="stats">
							<div className="player">
								<div className="avatar">
									<img src={profile.user?.avatar} width="75px" height="75px" alt=""></img>
								</div>
								{getButtonGameInvitation()}
								<div className="infos">
									<p>{profile.user?.name}</p>
									<p>{profile.user?.login}</p>
									<p>Level {profile.user ? Math.floor(profile.user.xp / 100) : 0}</p>
									<p>Progress for next level : {profile.user ? profile.user.xp % 100 : 0} %</p>
								</div>
							</div>
							<div className="graph">
								<p>Game played :<br />{profile.nbMatchs}</p>
								<Doughnut data={graphData} />
							</div>
						</div>
						<History target={profile.user} history={profile.history} />
					</div>
				</div>
			</div>
		);
	}
	else
		return (<></>)
}
