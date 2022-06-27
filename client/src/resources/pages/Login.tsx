import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { SocketContext } from '../../app/context/SocketContext';

const authEndpoint = 'https://api.intra.42.fr/oauth/authorize';

const scopes = [
	'public',
];

export const getAuthorizeHref = (): string => {
	const clientId = process.env.REACT_APP_API42_UID;
	const redirectUri = process.env.REACT_APP_API42_REDIRECT;
	return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=code`;
}

export const Login = () => {
	const navigate = useNavigate();
	const socket = useContext(SocketContext);

	useEffect(() => {
		if (socket?.connected)
			navigate('/');
	}, [navigate, socket?.connected]);

	return (
		<div id="login" className="bg-overlay rounded border-primary">
			<h1 className="text-neon-primary">Stonks Pong 3000</h1>
			<a className="btn border-neon-primary bg-overlay rounded square" href={getAuthorizeHref()}>
				<span className="content">Sign in with 42</span>
			</a>
		</div>
	);
}
