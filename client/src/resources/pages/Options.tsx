import { ChangeEvent, KeyboardEvent, useContext, useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { PacketPlayOutTotp } from '../../app/packets/PacketPlayOutTotp';
import { PacketPlayOutUserUpdate } from '../../app/packets/PacketPlayOutUserUpdate';
import { RootState } from '../../app/store';
import { ImageUploader } from '../components/ImageUploader';

export const Options = () => {
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);
	const [name, setName] = useState(user?.name);

	useEffect(() => {
		if (user && name === undefined)
			setName(user.name);
	}, [user, name]);

	const newTotp = (): void => {
		socket?.emit('user', new PacketPlayOutTotp());
	};

	const newName = (e: ChangeEvent<HTMLInputElement>): void => {
		setName(e.target.value);
	};

	const validateName = (event: KeyboardEvent<HTMLInputElement>): void => {
		if ((event.key === 'Enter' || event.keyCode === 13) && name && name !== user?.name) {
			socket?.emit('user', new PacketPlayOutUserUpdate({name: name}));
		}
	};

	const getTotp = (): JSX.Element | null => {
		if (user?.totp && typeof user?.totp === 'string') {
			return (<div style={{ backgroundColor: 'white', padding: '15px', display: 'flex', justifyContent: 'center' }}>
				<div style={{ padding: '6px', border: '4px solid' }}>
					<QRCode style={{ display: 'block' }} value={user.totp} />
				</div>
			</div>);
		}
		return null;
	};

	return (
		<div className='options'>
			<div className='optionsWindow'>
				<div className='optionsAvatar'>
					<h2>Choose your Avatar</h2>
					<ImageUploader />
					<h2>Change your username</h2>
					<label>Enter your name:
						<input type="text" value={name ?? ''} onChange={newName} onKeyDown={validateName} />
					</label>
					<h2>Two factor authentification</h2>
					<button onClick={newTotp}>{!user?.totp ? 'Enable ' : 'Disable '}2fa</button>
					{ getTotp() }
				</div>
			</div>
		</div>
	);
};
