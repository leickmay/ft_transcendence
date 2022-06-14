import { ChangeEvent, KeyboardEvent, useContext, useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { PacketPlayOutTotp } from '../../app/packets/PacketPlayOutTotp';
import { PacketPlayOutUserUpdate } from '../../app/packets/PacketPlayOutUserUpdate';
import { updateUser } from '../../app/slices/usersSlice';
import { RootState } from '../../app/store';
import { ImageUploader } from '../components/ImageUploader';

export const Options = () => {
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);
	const [name, setName] = useState(user?.name);
	const dispatch = useDispatch();

	useEffect(() => {
		if (user?.name)
			setName(user.name);
	}, [user?.name]);

	const newTotp = (): void => {
		socket?.emit('user', new PacketPlayOutTotp());
	};

	const newName = (e: ChangeEvent<HTMLInputElement>): void => {
		setName(e.target.value);
	};

	const validateName = (event: KeyboardEvent<HTMLInputElement>): void => {
		if ((event.key === 'Enter' || event.keyCode === 13) && name && name !== user?.name) {
			if (!event.currentTarget.checkValidity())
				event.currentTarget.reportValidity();
			else
				socket?.emit('user', new PacketPlayOutUserUpdate({ name: name }));
		}
	};

	const getTotp = (): JSX.Element | null => {
		if (user?.totp && typeof user?.totp === 'string') {
			return (
				<section id='totp-qr' className='overlay pointer' onClick={closeTotp}>
					<div className='cursor' onClick={e => e.stopPropagation()}>
						<div style={{ padding: '6px', border: '4px solid' }}>
							<QRCode style={{ display: 'block' }} value={user.totp} />
						</div>
					</div>
				</section>
			);
		}
		return null;
	};

	const closeTotp = (evt: any) => {
		if (user)
			dispatch(updateUser({ id: user.id, totp: !!user.totp }));
	}

	return (
		<div id='options' className='container'>
			<h2>Choose your Avatar</h2>
			<ImageUploader />
			<h2>Change your username</h2>
			<input maxLength={20} pattern="^[A-Za-zÀ-ÖØ-öø-ÿ]+(( |-)?[A-Za-zÀ-ÖØ-öø-ÿ]+)*$" className='border-primary' type="text" value={name ?? ''} onChange={newName} onKeyDown={validateName} />
			<h2>Two factor authentification</h2>
			<button className='border-primary' onClick={newTotp}>{!user?.totp ? 'Enable ' : 'Disable '}2fa</button>
			{getTotp()}
		</div>
	);
};
