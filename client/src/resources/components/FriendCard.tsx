import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { User } from "../../app/interfaces/User";
import { PacketPlayOutFriends } from "../../app/packets/PacketPlayOutFriends";
import { RootState } from "../../app/store";
import icon_offline from '../../assets/images/offline.png';
import icon_online from '../../assets/images/online.png';

interface Props {
	user: User;
}

export const FriendCard = (props: Props) => {
	const socket = useContext(SocketContext);
	const online = useSelector((state: RootState) => state.users.online);

	let button = (): JSX.Element => {
		return (<div onClick={() => socket?.emit('user', new PacketPlayOutFriends('remove', props.user.id))}>
			<p className="pointer" style={{fontSize: '1rem'}}>Retirer l'amis</p>
		</div>);
	}

	let isOnline = (): boolean => {
		return !!online.includes(props.user.id);
	}

	return (
		<div className="friendCard">
			<div className="friendCardUp">
				<img src={isOnline() ? icon_online : icon_offline} width="40" height="40" alt=""></img>
				{/* <img src={ingameSrc} width="40" height="40" alt=""></img> */}
			</div>
			<div className="friendCardDown">
				<img src={props.user.avatar} width="100" height="100" align-item="bottom" alt=""></img>
				<div>{props.user.name}</div>
				{ button() }
				{/* <div> lvl {props.user.level}</div> */}
				{/* <button type="submit" onClick={() => {props.delFriend(props.user.name)}}></button> */}
			</div>
		</div>
	);
};
