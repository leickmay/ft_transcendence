import { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from "react-router";
import { Route, Routes } from 'react-router-dom';
import { RootState } from '../../app/store';
import Navigation from '../components/Navigation';
import { Friends } from '../pages/Friends';
import { Game } from '../pages/Game';
import { History } from '../pages/History';
import { Menu } from '../pages/Menu';
import { Options } from '../pages/Options';
import { Statistics } from '../pages/Statistics';

interface Props {
}

export function Home(props: Props) {
	const [loadingElement, setLoadingElement] = useState<ReactElement>();
	const connected = useSelector((state: RootState) => state.socket.connected);

	useEffect(() => {
		if (!connected) {
			setLoadingElement(<div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}><div className="spinner-grow" role="status"></div></div>);
		} else {
			setLoadingElement(undefined);
		}
	}, [connected]);

	return (
		<>
			{ loadingElement }
			<Navigation />
			<Routes>
				<Route path="/" element={<Menu />} />
				<Route path="/friends" element={<Friends />} />
				<Route path="/game" element={<Game />} />
				<Route path="/history" element={<History />} />
				<Route path="/statistics" element={<Statistics />} />
				<Route path="/options" element={<Options />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</>
	);
}
