import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { User } from '../interfaces/User';
import { setUser } from '../slices/userSlice';

export const fetchCurrentUser = (headers: HeadersInit): any => {
	return async (dispatch: Dispatch<AnyAction>, getState: any) => {
		let res = await fetch('/api/users/', {headers})
		if (!res.ok)
				throw res.statusText;
		let user: User = await res.json();
		dispatch(setUser(user));
	};
};
