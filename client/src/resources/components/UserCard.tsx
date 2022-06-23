import { useCallback, useContext } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { SocketContext } from "../../app/context/SocketContext";
import { logout } from "../../app/Helpers";
import { User } from "../../app/interfaces/User";
import { PacketPlayOutProfile } from "../../app/packets/PacketPlayOutProfile";
import { RootState } from "../../app/store";
import unknownAvatar from '../../assets/images/unknown.png';

interface Props {
	user?: User;
}

export const UserCard = (props: Props) => {
	const navigate = useNavigate();
	const socket = useContext(SocketContext);
	const [, , removeCookie] = useCookies(['access_token']);
	const user = useSelector((state: RootState) => state.users.current);

	let openProfile = useCallback(() => {
		if (user)
			socket?.emit('stats', new PacketPlayOutProfile(user.login));
	}, [user, socket]);

	return (
		<div className="nav-card bg-overlay rounded pointer" onClick={openProfile}>
			<img src={user?.avatar || unknownAvatar} width="75px" height="75px" alt=""></img>
			<div>
				<h4>{user?.name || '...'}</h4>
				<h5>lvl {Math.floor((user?.xp ?? 0) / 100)}</h5>
				<div className="btn" onClick={(e) => {
					e.stopPropagation();
					logout(removeCookie, navigate, socket);
				}}></div>
			</div>
		</div>
	);
};
