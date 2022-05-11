import { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import '../scss/pages/login.scss';

const authEndpoint = 'https://api.intra.42.fr/oauth/authorize';

const scopes = [
	'public',
];

export const getAuthorizeHref = (): string => {
	const clientId = process.env.REACT_APP_API42_UID;
	const redirectUri = process.env.REACT_APP_API42_REDIRECT;
	return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=code`;
}

export function Login() {
	const navigate = useNavigate();

	const debugLogin = async (event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
		if (event.code === 'Enter' || event.keyCode === 13) {
			const target: HTMLInputElement = event.currentTarget;
			
			fetch('/api/debug/?id=' + target.value)
			.then(res => {
				if (!res.ok)
					throw new Error('Unknown user');
				navigate('/');
			})
			.catch(() => {
				target.value = '';
			});
		}
	}
	
	return (
		<div id="login" className="overlay border-primary">
			<h1 className="text-neon-primary">Stonks Pong 3000</h1>
			<a className="btn border-neon-primary overlay square" href={getAuthorizeHref()}>
				<span className="content">Sign in with 42</span>
			</a>
			<input type="number" onKeyDown={debugLogin} placeholder='Debug Login'/>
		</div>
	);
}
