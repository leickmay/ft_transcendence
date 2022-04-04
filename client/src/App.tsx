import { BrowserRouter, Routes, Route } from "react-router-dom"
import Connect from './pages/Connect';
import Friends from './pages/Friends';
import Game from './pages/Game';
import History from './pages/History';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Options from './pages/Options';
import Statisitcs from './pages/Statistics';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, createContext } from "react";
import { getUser } from "./redux/actions/user.actions";
import { updateUser } from "./redux/actions/users.actions";
import { getChannel } from "./redux/actions/channel.actions";
import { getChannels } from "./redux/actions/channels.actions";
import { Loading } from "./pages/Loading";
//import ChatSocket from "./components/ChatSocket";

function App() {
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.userReducer);

	useEffect(() => {
		let storedData = window.localStorage.user ? window.localStorage.user.split(",") : null;
		if (storedData)
		{
			dispatch(getUser(storedData[0]));
			dispatch(updateUser(storedData[1], {online: true}));
		}
		dispatch(getChannels());
		dispatch(getChannel(1));
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Connect />} />
				<Route path="/loading" element={<Loading />} />
				<Route path="/home" element={<Home />}/>
				<Route path="/friends" element={<Friends />} />
				<Route path="/game" element={<Game />} />
				<Route path="/history" element={<History />} />
				<Route path="/statistics" element={<Statisitcs />} />
				<Route path="/options" element={<Options />} />
				<Route element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);

}

export default App;

