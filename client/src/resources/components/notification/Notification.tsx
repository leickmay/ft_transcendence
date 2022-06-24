interface Props {
	text: string,
	visible: boolean,
}

export const Notification = (props: Props) => {
	return (
		<div className={'bg-overlay rounded ' + (props.visible ? 'show' : '')}>
			<span>{props.text}</span>
		</div>
	)
}
