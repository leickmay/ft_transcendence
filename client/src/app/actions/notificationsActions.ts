import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { popNotification, pushNotification } from '../slices/notificationsSlice';

export const addNotification = (message: string) => async (dispatch: Dispatch<AnyAction>) => {
	dispatch(pushNotification(message));
	await new Promise(resolve => setTimeout(resolve, 5000));
	dispatch(popNotification());
};
