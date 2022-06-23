import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCallback, useContext, useMemo } from "react";
import { SocketContext } from "../../app/context/SocketContext";
import { MatchResult } from "../../app/interfaces/Stats";
import { User } from "../../app/interfaces/User";
import { PacketPlayOutProfile } from "../../app/packets/PacketPlayOutProfile";

dayjs.extend(relativeTime);

interface Props {
	target: User,
	history: Array<MatchResult>,
}

export const History = (props: Props) => {
	const socket = useContext(SocketContext);

	let openProfile = useCallback((login: string) => {
		socket?.emit('stats', new PacketPlayOutProfile(login));
	}, [socket]);

	let matches = useMemo(() => {
		let targetId = props.target.id;
		return props.history.map((m, i) => {
			let opponent = m.player1.id === targetId ? m.player2 : m.player1;
			return (
				<tr key={i}>
					<th title={dayjs(m.createdDate).format('HH:mm:ss DD/MM/YYYY')}>{dayjs(m.createdDate).fromNow()}</th>
					<td className="pointer" onClick={() => openProfile(opponent.login)}>{opponent.name}</td>
					<td>{m.winner === targetId ? 'Won' : 'Lost'}</td>
				</tr>
			);
		});
	}, [props.target, props.history, openProfile])

	return (
		<div className="history">
			<h4>Last Matches</h4>
			<div>
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Opponent</th>
							<th>Result</th>
						</tr>
					</thead>
					<tbody>
						{matches}
					</tbody>
				</table>
			</div>
		</div>
	)
}