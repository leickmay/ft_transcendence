import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { getNameRoom } from '../../resources/pages/Chat';
import { PacketPlayInChatMessage } from '../packets/chat/PacketPlayInChat';
import { newMessages } from '../slices/chatSlice';
import { RootState } from '../store';
import { pushNotification } from './notificationsActions';

export const receiveMessage = (packet: PacketPlayInChatMessage) => (dispatch: ThunkDispatch<RootState, unknown, AnyAction>, getState: () => RootState) => {
	dispatch(newMessages(packet));
	if (getState().users.current?.login === packet.message.from)
		return;
	if (getState().chat.usersBlocked) {
		if (getState().chat.usersBlocked.find(x => x === packet.message.from))
			return;
	}
	let room = getState().chat.rooms?.find(x => x.id === packet.room);
	if (!room)
		return;
	let notification = getNameRoom(room)?.toString() + "(" + packet.message.from + ") : " + packet.message.text.substring(0, 16);
	dispatch(pushNotification(notification));
};
