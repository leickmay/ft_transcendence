import { KeyboardEvent, useState } from 'react';
import { useNavigate } from 'react-router';

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

	const [rain, setRain] = useState(false);
	
	if (!rain)
		return (
			<div className="connect">
				<button type="submit" onClick={() => setRain(true)}>Sign in the rain</button>
				<button type="submit" onClick={() => window.open(getAuthorizeHref(), "_self")}>Sign in with 42</button>
				<input type="number" onKeyDown={debugLogin} placeholder='Debug Login'/>
			</div>
		);
	else 
			return (
				<div className="video-responsive">
					<iframe width="560" height="315" src="https://www.youtube.com/embed/D1ZYhVpdXbQ?autoplay=1?controls=0&amp;start=66" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ></iframe>
				</div>
			);
}
