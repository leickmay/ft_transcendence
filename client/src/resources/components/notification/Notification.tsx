import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { hideNotification, Notification } from "../../../app/slices/notificationsSlice";
import { RootState } from "../../../app/store";

interface Props {
	id: number,
	content: Notification,
	visible: boolean,
}

export const NotificationElement = (props: Props) => {
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

	const clicked = useCallback(() => {
		console.log(props.content.button?.text);
		if (props.content.button?.text === 'ACCEPT_GAME_INVITATION')
			console.log('WHEEEE!!!');
		dispatch(hideNotification(props.id));
	}, [props.content.button?.text]);

	return (
		<div className={'bg-overlay rounded ' + (props.visible ? 'show' : '')}>
			<span>{props.content.text}</span>
			{props.content.button &&
				<button onClick={clicked}>{props.content.button.text}</button>
			}
		</div>
	)
}
