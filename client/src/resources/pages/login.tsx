import { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';

import '../scss/login.scss'

const authEndpoint = 'https://api.intra.42.fr/oauth/authorize';

const scopes = [
	'public',
];

export const getAuthorizeHref = (): string => {
	const clientId = '32e445666f212da52b3a7811bf1ff13d37cfb105f4870eb38365337172af351a';
	const redirectUri = 'http://127.0.0.1:80/loading';
	return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=code`;
}

export function Login() {
	const navigate = useNavigate();

	const debugLogin = async (el: KeyboardEvent<HTMLInputElement>): Promise<void> => {
		if (el.code === 'Enter') {
			const target: HTMLInputElement = el.currentTarget;
			
			fetch('/api/login/?id=' + target.value)
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
		<main className="form-signin text-center">
			<img className="mb-4" src="https://getbootstrap.com/docs/5.1/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
			<button className="mb-3 w-100 btn btn-lg btn-secondary" type="submit"
					onClick={() => window.open(getAuthorizeHref(), "_self")}
				>
						Sign in with 42
			</button>
			<input type="number" onKeyDown={debugLogin} />
			<p className="mb-3 text-muted">&copy; 1961–2967</p>
		</main>
	);
}
