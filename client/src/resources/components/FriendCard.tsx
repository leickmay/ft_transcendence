import { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../app/context/SocketContext';
import { User } from '../../app/interfaces/User';
import { PacketPlayOutGameSpectateRequest } from '../../app/packets/PacketPlayOutGameSpectateRequest';
import { PacketPlayOutProfile } from '../../app/packets/PacketPlayOutProfile';
import { RootState } from '../../app/store';

interface Props {
	user: User;
}

export const FriendCard = (props: Props) => {
	const socket = useContext(SocketContext);
	const online = useSelector((state: RootState) => state.users.online);

	let isOnline = useMemo((): boolean => {
		return !!online.find(u => u.id === props.user.id);
	}, [props.user, online]);

	let isPlaying = useMemo((): boolean => {
		return !!online.find(u => u.id === props.user.id)?.playing;
	}, [props.user, online]);

	let spectate = useCallback((): void => {
		socket?.emit('game', new PacketPlayOutGameSpectateRequest(props.user.id));
	}, [props.user, socket]);

	let openProfile = useCallback(() => {
		socket?.emit('stats', new PacketPlayOutProfile(props.user.login));
	}, [props.user, socket]);

	return (
		<li className='user-card'>
			<div className='avatar pointer' onClick={openProfile}>
				<img className='playerAvatar' src={props.user.avatar} width='50px' height='50px' alt=''></img>
			</div>
			<div className='text pointer' onClick={openProfile}>
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
