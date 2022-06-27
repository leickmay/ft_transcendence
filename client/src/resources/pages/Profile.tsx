import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useCallback, useContext, useMemo, useRef } from "react";
import { Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { SocketContext } from "../../app/context/SocketContext";
import { PacketPlayOutFriends } from "../../app/packets/PacketPlayOutFriends";
import { PacketPlayOutPlayerInvite } from "../../app/packets/PacketPlayOutPlayerInvite";
import { setInvitationTarget } from "../../app/slices/profileSlice";
import { resetProfile } from "../../app/slices/profileSlice";
import { RootState } from "../../app/store";
import { History } from "../components/History";
import { GameStatus } from "../../app/interfaces/Game.interface";
import { GameContext } from "../../app/context/GameContext";

ChartJS.register(ArcElement, Tooltip, Legend);

export const Profile = () => {
	const socket = useContext(SocketContext);
	const navigate = useNavigate();
	
	const { players } = useContext(GameContext);
	const friends = useSelector((state: RootState) => state.users.friends);
	const profile = useSelector((state: RootState) => state.profile);
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
	const ref = useRef<HTMLInputElement>(null);
	const invitation = useSelector((state: RootState) => state.profile.invitation);
	const online = useSelector((state: RootState) => state.users.online);
	const game = useSelector((state: RootState) => state.game);

	const handleClose = useCallback(() => {
		dispatch(resetProfile());
	}, [dispatch]);

	let removeFriend = useMemo((): JSX.Element => {
		if (friends.find(f => f.id === profile.user?.id)) {
			return(<button className="button-hovered" onClick={() => {
				socket?.emit('user', new PacketPlayOutFriends('remove', profile.user?.id));
				handleClose();
			}}>Remove friend&nbsp;&nbsp;🗑</button>);
		}
		return <></>;
	}, [profile.user, friends, socket, handleClose]);

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

	const sendInvitation = useCallback(() => {
		let target = profile.user?.id;
		if (!target)
			return;
		socket?.emit('game', new PacketPlayOutPlayerInvite(target));
		dispatch(setInvitationTarget(profile.user?.id || -1));
		navigate('/game', {replace: true});
		dispatch(resetProfile());
	}, [profile, dispatch, navigate, socket])

	const getButtonGameInvitation = useMemo(() => {		
		if (!online.find(x => x.id === profile.user?.id))
			return <></>;
		if (game.status !== GameStatus.NONE && game.status !== GameStatus.WAITING) {
			return <button disabled>Cannot invite now</button>
		} else if (players.length >= game.maxPlayers) {
			return <button disabled>Your game is full</button>
		} else {
			if (profile.user?.id === invitation.target)
				return <button disabled>Invited</button>;
			else if (invitation.target)
				return <button disabled>You have already sent an invitation</button>;
			else
				return <button className="button-hovered" onClick={sendInvitation}> Send Game Invitation&nbsp;&nbsp;📩</button>
		}
	}, [online, profile.user, invitation, game, players.length, sendInvitation]);

	if (profile.user) {
		return (
			<div id="profile" className="pointer overlay" onClick={handleClose}>
				<div ref={ref} className="box cursor" onClick={e => e.stopPropagation()}>
					<span className="close-icon pointer" onClick={handleClose}>╳</span>
					{getButtonGameInvitation}
					{removeFriend}
					<div className='profile'>
						<div className="stats">
							<div className="player">
								<div className="avatar">
									<img src={profile.user?.avatar} width="75px" height="75px" alt=""></img>
								</div>
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
