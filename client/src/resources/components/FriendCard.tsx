import { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/SocketContext';
import { User } from '../../app/interfaces/User';
import { PacketPlayOutFriends } from '../../app/packets/PacketPlayOutFriends';
import { PacketPlayOutGameSpectateRequest } from '../../app/packets/PacketPlayOutGameSpectateRequest';
import { RootState } from '../../app/store';

interface Props {
	user: User;
}

export const FriendCard = (props: Props) => {
	const socket = useContext(SocketContext);
	const online = useSelector((state: RootState) => state.users.online);

	let button = (): JSX.Element => {
		return (<div onClick={() => socket?.emit('user', new PacketPlayOutFriends('remove', props.user.id))}>
			<p className='pointer' style={{ fontSize: '1rem' }}>Retirer l'amis</p>
		</div>);
	}

	let isOnline = useMemo((): boolean => {
		return !!online.find(u => u.id === props.user.id);
	}, [props.user, online]);

	let isPlaying = useMemo((): boolean => {
		return !!online.find(u => u.id === props.user.id)?.playing;
	}, [props.user, online]);

	let spectate = useCallback((): void => {
		socket?.send(new PacketPlayOutGameSpectateRequest(props.user.id));
	}, [props.user]);

	return (
		<li className='user-card'>
			<div className='avatar'>
				<img className='playerAvatar' src={props.user.avatar} width='50px' height='50px' alt=''></img>
			</div>
			<div className='text'>
				<p><strong>{props.user.name}</strong></p>
				<p><small>{props.user.login}</small></p>
			</div>
			<div className='status' data-online={isOnline}>
				{isOnline &&
					<button data-playing={isPlaying} aria-label='spectate' title='Spectate' onClick={spectate}>
						🎮
					</button>
				}
				<span></span>
			</div>
		</li>
	);
};
