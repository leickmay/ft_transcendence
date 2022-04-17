import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { io, Socket } from 'socket.io-client';

import { UserCard } from '../components/UserCard';
import { UsersList } from '../components/UsersList';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { fetchCurrentUser } from '../../app/actions/UserActions';
import { User } from '../../app/interfaces/User';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';

interface Props {
}

export function Menu(props: Props) {
	// const [user, setUser] = useState<User>();
	const [cookies] = useCookies();
	const navigate = useNavigate();

	const user: User | undefined = useSelector((state: RootState) => state.user.user.value);
	const dispatch: Dispatch<AnyAction> = useDispatch();

	const getHeaders = useCallback(async () => {
		const token = await cookies.access_token;
		return {
			'Authorization': 'Bearer ' + token
		};
	}, [cookies.access_token]);

	useEffect(() => {
		const startSockets = async (): Promise<Socket> => {
			return io('http://localhost:3001', {extraHeaders: await getHeaders()});
		};

		startSockets();
	}, [getHeaders]);

	useEffect(() => {
		const connect = async () => {
			const headers: HeadersInit = await getHeaders();
			await dispatch(fetchCurrentUser(headers));
		}

		connect()
		.catch(() => {
			navigate('/login');
		});
	}, [getHeaders]);

	return (
		<div>
			<UserCard user={ user } />
			<UsersList />
		</div>
	);
}
