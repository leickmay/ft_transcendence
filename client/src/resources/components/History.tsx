import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from "react";
import { MatchResult } from "../../app/interfaces/Stats";
import { User } from "../../app/interfaces/User";

dayjs.extend(relativeTime);

interface Props {
	target: User,
	history: Array<MatchResult>,
}

export const History = (props: Props) => {
	let matches = useMemo(() => {
		let targetId = props.target.id;
		return props.history.map((m, i) =>
			<tr key={i}>
				<th title={dayjs(m.createdDate).format('HH:mm:ss DD/MM/YYYY')}>{dayjs(m.createdDate).fromNow()}</th>
				<td>{m.player1.id === targetId ? m.player2.name : m.player1.name}</td>
				<td>{m.winner === targetId ? 'Won' : 'Lost'}</td>
			</tr>
		);
	}, [props.target, props.history])

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