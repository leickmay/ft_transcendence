import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
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
    const [img, setImg] = useState("");
	const [cookies] = useCookies();

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
		socket?.emit('totp', {action: 'toggle'});
	};

	const newName = (e: ChangeEvent<HTMLInputElement>): void => {
		console.log(e);
		setName(e.target.value);
		setTotpLoading(true);
		socket?.emit('option', {field: 'name', value: ''});
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

	useEffect(() => {
        const fetchImage = async () => {
            const res = await fetch("/api/users/avatar/" + user?.login, {
				headers: {
					'Authorization': 'Bearer ' + cookies.access_token,
				},
			});
            if (res.ok) {
                const imageBlob = await res.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setImg(imageObjectURL);
            }
        }

		if (user?.login)
        	fetchImage();
    }, [cookies.access_token, user?.login])

	return (
		<div className='options'>
			<div className='optionsWindow'>
				<div className='optionsAvatar'>
					<h2>Choose your Avatar</h2>
					<ImageUploader />
					{
						img ? (<img src={img} style={{ maxWidth: '100%' }} alt="avatar" />) : (<p>Loading...</p>)
					}
					<h2>Change your username</h2>
					<label>Enter your name:
						<input type="text" value={name} onChange={newName} />
					</label>
					<h2>Two factor authentification</h2>
					<button onClick={newTotp} disabled={totpLoading}>{!user?.totp ? 'Enable ' : 'Disable '}2fa</button>
					{ getTotp() }
				</div>
			</div>
		</div>
	);
};
