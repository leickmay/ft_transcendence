import { Route, Routes } from 'react-router-dom';
import { Loading } from '../pages/Loading';
import { Login } from '../pages/Login';
import { Connected } from '../wrappers/Connected';
import { install } from "resize-observer";

interface Props {
}


export default function App(props: Props) {
	install();
	return (
		<Routes>
			<Route path="/loading" element={<Loading />} />
			<Route path="/login" element={<Login />} />
			<Route path="*" element={<Connected />} />
		</Routes>
	);
}
