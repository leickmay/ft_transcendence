import { ChangeEvent, KeyboardEvent, useContext, useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { PacketPlayOutOptionUpdate, PacketPlayOutTotpRequest, UserOptions } from '../../app/packets';
import { setTotp } from "../../app/slices/usersSlice";
import { RootState } from '../../app/store';
import { ImageUploader } from '../components/ImageUploader';

export const Options = () => {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.users.current);
	const [totpLoading, setTotpLoading] = useState<boolean>(false);
	const [totpURL, setTotpURL] = useState<string | null>();
	const [name, setName] = useState(user?.name);	

	useEffect(() => {
		if (user && name === undefined)
			setName(user.name);
	}, [user, name]);

	useEffect(() => {
		socket?.on('totp', (data: {status: string, totp: string | null}) => {
			setTotpLoading(false);
			if (data.status === 'success') {
				setTotpURL(data.totp);
				dispatch(setTotp(!!data.totp));
			}
		});
		// socket?.on('option')

		return () => {
			socket?.off('totp');
		};
	}, [socket, dispatch]);

	const newTotp = (): void => {
		setTotpLoading(true);
		socket?.emit('totp', new PacketPlayOutTotpRequest('toggle'));
	};

	const newName = (e: ChangeEvent<HTMLInputElement>): void => {
		setName(e.target.value);
		setTotpLoading(true);
	};

	const validateName = (event: KeyboardEvent<HTMLInputElement>): void => {
		if ((event.key === 'Enter' || event.keyCode === 13) && name) {
			socket?.emit('option', new PacketPlayOutOptionUpdate(UserOptions.NAME, name));
		}
	};

	const getTotp = (): JSX.Element | null => {
		if (totpURL) {
			return (<div style={{ backgroundColor: 'white', padding: '15px', display: 'flex', justifyContent: 'center' }}>
				<div style={{ padding: '6px', border: '4px solid' }}>
					<QRCode style={{ display: 'block' }} value={totpURL} />
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
					<button onClick={newTotp} disabled={totpLoading}>{!user?.totp ? 'Enable ' : 'Disable '}2fa</button>
					{ getTotp() }
				</div>
			</div>
		</div>
	);
};
