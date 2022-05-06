import { useContext, useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { alertType } from '../../app/slices/alertSlice';
import { setTotp } from "../../app/slices/usersSlice";
import store, { RootState } from '../../app/store';
import { ImageUploader } from '../components/ImageUploader';

export const Options = () => {

	const socket = useContext(SocketContext);
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.users.current);
	const [totpLoading, setTotpLoading] = useState<boolean>(false);
	const [totpURL, setTotpURL] = useState<string>();
	const [name, setName] = useState("");
	const [cookies] = useCookies();

	async function getHeaders() {
		
		const token = await cookies.access_token;
		return {
			'Authorization': 'Bearer ' + token
		};
	};

	const changeLoginApi = async () => {
		const headers = await getHeaders();
		fetch("api/users/changelogin/" + name, {method: "POST", headers: headers})
		.then(res => {
			if (!res.ok)
			{
				store.dispatch(alertType("This username is already taken"));
				throw new Error('Already exists');
			}
		})
		.catch((e) => console.log("error : ", e));
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (name !== "") {
			changeLoginApi();
		}
	}

	useEffect(() => {
		socket?.on('totp', (data: {status: string, payload?: string}) => {
			setTotpLoading(false);
			if (data.status === 'enabled') {
				setTotpURL(data.payload);
				dispatch(setTotp(true));
			}
			if (data.status === 'disabled') {
				setTotpURL(undefined);
				dispatch(setTotp(false));
			}
		});

		return () => {
			socket?.off('totp');
		};
	}, [socket, dispatch]);

	const newTotp = (): void => {
		setTotpLoading(true);
		if (!user?.totp) {
			socket?.emit('totp', {action: 'add'});
		} else {
			socket?.emit('totp', {action: 'remove'});
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
					<div className='title'> 
						Choose your Avatar 
					</div>
					<ImageUploader />
					<div className='title'> 
						Change your username 
					</div>
					<label>Enter your name:
						<input 
							type="text" 
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</label>
					<button onClick={newTotp} disabled={totpLoading}>{!user?.totp ? 'Enable ' : 'Disable '}2fa</button>
					{ getTotp() }
				</div>
			</div>
		</div>
	);
};
