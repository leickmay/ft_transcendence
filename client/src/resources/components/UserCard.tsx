import { useContext } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { SocketContext } from "../../app/context/SocketContext";
import { logout } from "../../app/Helpers";
import { User } from "../../app/interfaces/User";
import { RootState } from "../../app/store";
import unknownAvatar from '../../assets/images/unknown.png';

interface Props {
	user?: User;
}

export const UserCard = (props: Props) => {
	const navigate = useNavigate();
	const socket = useContext(SocketContext);
	const [,, removeCookie] = useCookies(['access_token']);	
	const user = useSelector((state: RootState) => state.users.current);

	return (
		<div className="nav-card bg-overlay rounded">
			<img src={user?.avatar || unknownAvatar} width="75px" height="75px" alt=""></img>
			<div>
				<h4>{ user?.name || '...' }</h4>
				<h5>lvl {user ? Math.floor(user.xp / 100) : 0}</h5>
				{/* To change */}
				<div className="btn" onClick={() => {logout(removeCookie, navigate, socket)}}></div>
			</div>
		</div>
	);
};
