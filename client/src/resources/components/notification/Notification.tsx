interface Props {
	text: string,
	visible: boolean,
}

export const Notification = (props: Props) => {
	return (
		<div className={'overlay rounded ' + (props.visible ? 'show' : '')}>
			<span>{props.text}</span>
		</div>
	)
}
