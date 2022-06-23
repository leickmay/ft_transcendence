import { useContext } from "react";
import { SocketContext } from "../../app/context/socket";
import { User } from "../../app/interfaces/User"
import { PacketPlayOutProfile } from "../../app/packets/PacketPlayOutProfile";


interface Props {
	user: User,
}

export const BoardCard = (props: Props) => {
	const socket = useContext(SocketContext);

	const togglePopup = () => {
		socket?.emit('stats', new PacketPlayOutProfile(props.user.login));
	}

	return (
		<tr className="boardcard">
			<th>
				<img onClick={togglePopup} src={props.user.avatar} width="75px" height="75px" alt=""></img>
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
