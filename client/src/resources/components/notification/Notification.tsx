
interface Props {
	text: string,
}

export const Notification = (props: Props) => {
	return (
		<div>
			<span>{props.text}</span>
		</div>
	)
}
