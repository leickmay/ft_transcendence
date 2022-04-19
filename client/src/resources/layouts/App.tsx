import { Route, Routes } from 'react-router-dom';
import { Loading } from '../pages/Loading';
import { Login } from '../pages/old-login';
import { Connected } from '../wrappers/Connected';

interface Props {
}

export default function App(props: Props) {
	return (
		<div className="App">
			<Routes>
				<Route path="/loading" element={<Loading />} />
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<Connected />} />
			</Routes>
		</div>
	);
}
