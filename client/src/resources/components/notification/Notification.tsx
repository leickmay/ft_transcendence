
interface Props {
	text: string,
}

export const Notification = (props: Props) => {
	return (
		<p>{props.text}</p>
	)
}
