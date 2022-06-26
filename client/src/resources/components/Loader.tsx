import { ReactElement, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/SocketContext';
import { RootState } from '../../app/store';

interface Props {
}

export const Loader = (props: Props) => {
	const [loadingElement, setLoadingElement] = useState<ReactElement>();

	const ready = useSelector((state: RootState) => state.socket.ready);
	const socket = useContext(SocketContext);

	useEffect(() => {
		if (ready) {
			setLoadingElement(undefined);
		} else {
			setLoadingElement(<div style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 15,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: 'rgba(0, 0, 0, 0.8)' }}><h3>Reconnection...</h3></div>);
		}
	}, [socket, ready]);

	return (
		<>
			{ loadingElement }
		</>
	);
}
