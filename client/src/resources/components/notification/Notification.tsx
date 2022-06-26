import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { SocketContext } from "../../../app/context/SocketContext";
import { PacketPlayOutPlayerAccept } from "../../../app/packets/PacketPlayOutPlayerAccept";
import { hideNotification, Notification } from "../../../app/slices/notificationsSlice";
import { InvitationStates, setInvitation } from "../../../app/slices/profileSlice";
import { RootState } from "../../../app/store";

interface Props {
	id: number,
	content: Notification,
	visible: boolean,
}

export const NotificationElement = (props: Props) => {
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
	const socket = useContext(SocketContext);
	const navigate = useNavigate();

	const clicked = () => {
		console.log(props.content.button?.data?.id);
		if (props.content.button?.action === 'ACCEPT_GAME_INVITATION') {
			let id = props.content.button.data?.id;
			if (id)
				socket?.emit('game', new PacketPlayOutPlayerAccept(id));
		}
		dispatch(setInvitation({
			status: InvitationStates.IN_GAME,
			target: -1,
		}));
		dispatch(hideNotification(props.id));
		navigate('/game', {replace: true});
	};

	return (
		<div className={'bg-overlay rounded ' + (props.visible ? 'show' : '')}>
			<span>{props.content.text}</span>
			{props.content.button &&
				<button onClick={clicked}>{props.content.button.text}</button>
			}
		</div>
	)
}
