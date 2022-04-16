import { Route, Routes } from 'react-router-dom';
import { SignIn } from './components/signin';
import { Home } from './pages/home';
import { Loading } from './pages/loading';
import './App.scss';

interface Props {
}

export default function App(props: Props) {
	return (
		<div className="App">
			<Routes>
				<Route path="/loading" element={<Loading />} />
				<Route path="/login" element={<SignIn />} />
				<Route path="*" element={<Home />} />
			</Routes>
		</div>
	);
}
