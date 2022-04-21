import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/Loader";

export function Loading() {
	const navigate = useNavigate();

	useEffect(() => {
		const loadData = async () => {
			const str: string[] = window.location.href.split('=');
			let res = await fetch('/api/code/' + str[1], { method: 'GET' });
			await res.json();
			navigate('/', {replace: true});
		};

		loadData().catch(() => navigate('/login'));
	}, [navigate]);

	return (
		<Loader />
	);
}
