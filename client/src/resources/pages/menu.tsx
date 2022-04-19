import { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { User } from '../../app/interfaces/User';
import { RootState } from '../../app/store';
import { UserCard } from '../components/UserCard';
import { UsersList } from '../components/UsersList';

interface Props {
}

export function Menu(props: Props) {
	const user: User | undefined = useSelector((state: RootState) => state.users.current);
	const connected: boolean = useSelector((state: RootState) => state.socket.connected);
	const [loadingElement, setLoadingElement] = useState<ReactElement>();

	useEffect(() => {
		if (!connected) {
			setLoadingElement(<div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}><div className="spinner-grow" role="status"></div></div>);
		} else {
			setLoadingElement(undefined);
		}
	}, [connected]);

	return (
		<div>
			{ loadingElement }
			<UserCard user={user} />
			<UsersList />
		</div>
	);
}
