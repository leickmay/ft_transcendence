import { useContext, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { RootState } from "../../app/store";

export const Options = () => {
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);
	const [totpLoading, setTotpLoading] = useState<boolean>(false);
	const [totpURL, setTotpURL] = useState<string>();

	useEffect(() => {
		socket?.on('totp', (data: {status: string, payload?: string}) => {
			setTotpLoading(false);
			if (data.status === 'enabled') {
				setTotpURL(data.payload);
			}
			if (data.status === 'disabled') {
				setTotpURL(undefined);
			}
		});

		return () => {
			socket?.off('totp');
		};
	}, [socket]);

	const newTotp = (): void => {
		setTotpLoading(true);
		if (!totpURL && !user?.totp) {
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
					<button onClick={newTotp} disabled={totpLoading}>{!totpURL ? 'Enable ' : 'Disable '}2fa</button>
					{ getTotp() }
				</div>
			</div>
		</div>
	);
};
