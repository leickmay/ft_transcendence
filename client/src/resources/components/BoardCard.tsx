import { useNavigate } from "react-router"
import { User } from "../../app/interfaces/User"

interface Props {
	user: User,
}

export const BoardCard = (props: Props) => {
	const navigate = useNavigate();
	const profile = () => {
		let url = '/profile/?name=' + props.user.login;
		navigate(url, { replace: true });
	}

	return (
		<tr className="boardcard">
			<th>
				<img onClick={profile} src={props.user.avatar} width="75px" height="75px" alt=""></img>
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
