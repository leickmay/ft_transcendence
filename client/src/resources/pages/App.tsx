import { Route, Routes } from 'react-router-dom';
import { Login } from './login';
import { Home } from './home';
import { Loading } from './loading';

import '../scss/App.scss';

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
