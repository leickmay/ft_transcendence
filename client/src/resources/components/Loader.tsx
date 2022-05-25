import { ReactElement, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/socket';
import { PacketPlayOutFriends } from '../../app/packets/packets';
import { RootState } from '../../app/store';

interface Props {
}

export function Loader(props: Props) {
	const [loadingElement, setLoadingElement] = useState<ReactElement>();

	const connected = useSelector((state: RootState) => state.socket.connected);
	const socket = useContext(SocketContext);

	useEffect(() => {
		if (!connected) {
			setLoadingElement(<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}><h3>Reconnection...</h3></div>);
		} else {
			socket?.emit('user', new PacketPlayOutFriends('get'))
			setLoadingElement(undefined);
		}
	}, [socket, connected]);

	return (
		<>
			{ loadingElement }
		</>
	);
}
