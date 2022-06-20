interface Props {
	date: Date;
	opponent: string;
	result: string;
}

export const HistoryCard = (props: Props) => {
	return (
		<tr className="historycard">
			<th>
				<p>{props.date.toLocaleDateString()}</p>
				<p>{props.date.toLocaleTimeString()}</p>
			</th>
			<td>
				<p>{props.opponent}</p>
			</td>
			<td>
				<p>{props.result}</p>
			</td>
		</tr>
	)
}