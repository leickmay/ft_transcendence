import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../app/Helpers";
import { User } from "../../app/interfaces/User";
import { RootState } from "../../app/store";

interface Props {
	user?: User;
}

const UserCard = (props: Props) => {
	const navigate = useNavigate();
	const [,, removeCookie] = useCookies(['access_token']);
	const user = useSelector((state: RootState) => state.users.current);

	return (
		<div className="userCard">
			<img className="userCardAvatar" src={user?.intraPicture} width="120px" height="120px" alt=""></img> 

			<div className="userCardInfo"> 
				<div>{ user?.login || '...' }</div>
				<div>lvl { /*user.level */ 0 }</div>
				<button type="submit" onClick={() => {logout(removeCookie, navigate)}}></button>
			</div>
		</div>
	);
};

export default UserCard;