import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../app/Helpers";
import { User } from "../../app/interfaces/User";
import { RootState } from "../../app/store";
import '../scss/components/user_card.scss';

interface Props {
	user?: User;
}

export const UserCard = (props: Props) => {
	const navigate = useNavigate();
	const [,, removeCookie] = useCookies(['access_token']);	
	const user = useSelector((state: RootState) => state.users.current);

	return (
		<div className="user-card overlay">
			<img src={user?.avatar || 'https://cdn.intra.42.fr/users/scros.jpg'} width="75px" height="75px" alt=""></img>
			<div> 
				<h4>{ user?.name || '...' }</h4>
				<h5>lvl { /*user.level */ 0 }</h5>
				{/* To change */}
				<div className="btn" onClick={() => {logout(removeCookie, navigate)}}></div>
			</div>
		</div>
	);
};
