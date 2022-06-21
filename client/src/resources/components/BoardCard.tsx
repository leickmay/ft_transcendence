import { userInfo } from "os";
import { useCallback, useContext } from "react";
import { useNavigate } from "react-router"
import { Socket } from "socket.io-client";
import { SocketContext } from "../../app/context/socket";
import { User } from "../../app/interfaces/User"
import { PacketPlayOutProfile } from "../../app/packets/PacketPlayOutProfile";



interface Props {
	user: User,
}


export const BoardCard = (props: Props) => {
	const socket = useContext(SocketContext);
	const navigate = useNavigate();
	const profile = () => {
		let url = '/profile/?name=' + props.user.login;
		navigate(url, { replace: true });
	}

	const request = useCallback((login: string) => {
		//socket?.emit('stats', new PacketPlayOutProfile(login));
		profile(); 
	}, [socket])

	return (
		<tr className="boardcard">
			<th>
				<img onClick={() => request(props.user.login)} src={props.user.avatar} width="75px" height="75px" alt=""></img>
				<p>{props.user.name}</p>
			</th>
			<td>
				<p>{props.user.nbMatch}</p>
			</td>
			<td>
				<p>{props.user.matchWon}</p>
			</td>
			<td>
				<p>{Math.floor(props.user.xp / 100)}</p>
				<p>{props.user.xp % 100} %</p>
			</td>
		</tr>
	)
}
