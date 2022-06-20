import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/SocketContext";
import { GameStatus, Player, Sides } from "../../app/interfaces/Game.interface";
import { User } from "../../app/interfaces/User";
import { PacketPlayOutFriends } from "../../app/packets/PacketPlayOutFriends";
import { RootState } from "../../app/store";
import icon_offline from '../../assets/images/offline.png';
import icon_online from '../../assets/images/online.png';

interface Props {
	player: Player;
}

export const PlayerCard = (props: Props) => {
	const socket = useContext(SocketContext);
	const game = useSelector((state: RootState) => state.game);
	const online = useSelector((state: RootState) => state.users.online);

	let button = (): JSX.Element => {
		return (<div onClick={() => socket?.emit('user', new PacketPlayOutFriends('remove', props.player.user.id))}>
			<p className="pointer" style={{fontSize: '1rem'}}>Retirer l'amis</p>
		</div>);
	}

	let isOnline = (): boolean => {
		return !!online.find(u => u.id === props.player.user.id);
	}

	return (
		<div className='user-card' data-direction={props.player && Sides[props.player.side]}>
			<div className='avatar'>
				<img className="playerAvatar" src={props.player.user.avatar} width="50px" height="50px" alt=""></img>
				{props.player.ready && game.status < GameStatus.RUNNING && (
					<div className='overlay'>
						<p className='text-neon2-secondary text-stroke-1'>Ready</p>
					</div>
				)}
			</div>
			<div className="text">
				<p><strong>{props.player.user.name}</strong></p>
				<p><small>{props.player.user.login}</small></p>
			</div>
		</div>
	);
};
