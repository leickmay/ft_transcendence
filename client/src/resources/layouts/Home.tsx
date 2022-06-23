import { Navigate } from "react-router";
import { Route, Routes } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { Navigation } from '../components/Navigation';
import { Notifications } from '../components/notification/Notifications';
import { SocketListener } from "../components/SocketListener";
import { Chat } from '../pages/Chat';
import { Friends } from '../pages/Friends';
import { Game } from '../pages/Game';
import { Leaderboard } from "../pages/Leaderboard";
import { Options } from '../pages/Options';
import { Profile } from "../pages/Profile";
import { Statistics } from '../pages/Statistics';

interface Props {
}

export function Home(props: Props) {
	return (
		<>
			<SocketListener />
			<Notifications />
			<Navigation />
			<Loader />
			<Profile />
			<Routes>
				<Route path="/" element={<Game />} />
				<Route path="/friends" element={<Friends />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="/statistics" element={<Statistics />} />
				<Route path="/leaderboard" element={<Leaderboard />} />
				<Route path="/options" element={<Options />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</>
	);
}
