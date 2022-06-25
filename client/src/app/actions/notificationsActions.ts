import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { Notification, addNotification, hideNotification, popNotification } from '../slices/notificationsSlice';
import { RootState } from '../store';

export const pushNotification = (content: Notification) => async (dispatch: ThunkDispatch<RootState, unknown, AnyAction>, getState: () => RootState) => {
	let id = getState().notifications.next;
	dispatch(addNotification(content));
	await new Promise(resolve => setTimeout(resolve, content.duration || getState().notifications.duration));
	dispatch(hideNotification(id));
	await new Promise(resolve => setTimeout(resolve, 1000));
	dispatch(popNotification(id));
};
