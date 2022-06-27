import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/Loader";

export const Loading = () => {
	const navigate = useNavigate();
	const [, setCookie] = useCookies(['access_token']);

	useEffect(() => {
		const loadData = async () => {
			const str: string[] = window.location.href.split('=');
			let res = await fetch('/api/login', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({ 'code': str[1], }),
			});
			if (!res.ok)
				throw res.statusText;
			setCookie('access_token', await res.text(), {
				sameSite: 'lax',
			});
			navigate('/', {replace: true});
		};

		loadData().catch(() => navigate('/login'));
	}, [navigate, setCookie]);

	return (
		<Loader />
	);
}
