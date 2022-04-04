import { useDispatch, useSelector } from "react-redux";

const FriendCard = ({ props }: any) => {
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.userReducer);

	var onlineSrc;
	var ingameSrc;
	var trashSrc = "./assets/images/trash.png";

	props.friendCard.online ? (onlineSrc = "./assets/images/online.png") : (onlineSrc = "./assets/images/offline.png");
	props.friendCard.ingame ? (ingameSrc = "./assets/images/ingame.png") : (ingameSrc = "./assets/images/outgame.png");

	return (
		<div className='friendCard'>
			<div className='friendCardUp'>
				<img src={onlineSrc} width="40" height="40" alt=""></img>
				<img className='spec' src={ingameSrc} width="40" height="40" alt=""></img>
			</div>
			<div className='friendCardDown'>
				<img src={props.friendCard.avatar} width="100" height="100" align-item="bottom" alt=""></img>
				<div> {props.friendCard.name}</div>
				<div> lvl {props.friendCard.level}</div>
				<button type='submit' onClick={() => {props.delFriend(props.friendCard.name)}}></button>
			</div>
		</div>
	);
};

export default FriendCard;