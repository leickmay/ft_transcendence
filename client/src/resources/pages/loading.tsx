import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Loading() {
	const navigate = useNavigate();

	useEffect(() => {
		const loadData = async () => {
			const str: string[] = window.location.href.split('=');
			let res = await fetch('/api/code/' + str[1], { method: 'GET' });
			await res.json();
			navigate('/');
		};

		loadData();
	}, [navigate]);

	return (
		<div>
			<div className="spinner-grow" role="status"></div>
		</div>
	);
}
