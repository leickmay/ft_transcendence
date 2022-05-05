import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { User } from "../../app/interfaces/User";
import { RootState } from "../../app/store";

interface Props {
	user?: User;
}

const UserCard = (props: Props) => {
	const navigate = useNavigate();
	const [,, removeCookie] = useCookies();
	const user = useSelector((state: RootState) => state.users.current);

	const logout = () => {
		removeCookie('access_token');
		navigate('/login');
	};

	return (
		<div className="userCard">
			<img className="userCardAvatar" src={user?.intraPicture} width="120px" height="120px" alt=""></img> 

			<div className="userCardInfo"> 
				<div>{ user?.login || '...' }</div>
				<div>lvl { /*user.level */ 0 }</div>
				<button type="submit" onClick={() => {logout()}}></button>
			</div>
		</div>
	);
};

export default UserCard;