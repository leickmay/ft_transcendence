import { Route, Routes } from 'react-router-dom';
import '../scss/App.scss';
import { Home } from './home';
import { Loading } from './loading';
import { Login } from './login';

interface Props {
}

export default function App(props: Props) {
	return (
		<div className="App">
			<Routes>
				<Route path="/loading" element={<Loading />} />
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<Home />} />
			</Routes>
		</div>
	);
}
