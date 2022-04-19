export const Connect = () => {
	const authEndpoint = 'https://api.intra.42.fr/oauth/authorize';

	const scopes = [
		'public',
	];

	const getAuthorizeHref = (): string => {
		const clientId = '0f3b46da8a8d75d766c4c3af8cc92a0c522cc646686afbe32e950c9d61506951';
		const redirectUri = 'http://127.0.0.1:80/loading';
		return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=code`;
	}

	return (
		<div className="connect">
			<button type="submit" onClick={() => window.open(getAuthorizeHref(), "_self")}>Sign in with 42</button>
		</div>
	);
};
