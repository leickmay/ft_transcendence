import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { addNotification, hideNotification, popNotification } from '../slices/notificationsSlice';
import { RootState } from '../store';

export const pushNotification = (message: string) => async (dispatch: Dispatch<AnyAction>, getState: () => RootState) => {
	let id = getState().notifications.next;
	dispatch(addNotification(message));
	await new Promise(resolve => setTimeout(resolve, getState().notifications.duration));
	dispatch(hideNotification(id));
	await new Promise(resolve => setTimeout(resolve, 1000));
	dispatch(popNotification());
};
