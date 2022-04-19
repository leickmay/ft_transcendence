import { useDispatch, useSelector } from "react-redux";
import { User } from "../../app/interfaces/User";

interface Props {
	user: User;
}

const FriendCard = (props: Props) => {
	return (
		<div className='friendCard'>
			<div className='friendCardUp'>
				{/* <img src={onlineSrc} width="40" height="40" alt=""></img> */}
				{/* <img className='spec' src={ingameSrc} width="40" height="40" alt=""></img> */}
			</div>
			<div className='friendCardDown'>
				<img src={props.user.avatar} width="100" height="100" align-item="bottom" alt=""></img>
				<div> {props.user.name}</div>
				{/* <div> lvl {props.user.level}</div> */}
				{/* <button type='submit' onClick={() => {props.delFriend(props.user.name)}}></button> */}
			</div>
		</div>
	);
};

export default FriendCard;