import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { User } from "../../app/interfaces/User";
import { RootState } from "../../app/store";

interface Props {
	user: User;
}

const FriendCard = (props: Props) => {
	const socket = useContext(SocketContext);
	const online = useSelector((state: RootState) => state.users.online);

	let button = (): JSX.Element => {
		return (<div onClick={() => socket?.emit('friend', {
			action: 'remove',
			id: props.user.id,
		})}>
			<p className="pointer" style={{fontSize: '1rem'}}>Retirer l'amis</p>
		</div>);
	}

	let isOnline = (): boolean => {
		return !!online.find(o => o.id === props.user.id);
	}

	return (
		<div className="friendCard">
			<div className="friendCardUp">
				<img src={
					isOnline() ? 'assets/images/online.png' : 'assets/images/offline.png'
				} width="40" height="40" alt=""></img>
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

export default FriendCard;