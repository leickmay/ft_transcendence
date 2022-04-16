import { Route, Routes } from 'react-router-dom';
import { Menu } from './menu';
import { Page404 } from './Page404';

interface Props {
}

export function Home(props: Props) {
	return (
		<Routes>
			<Route path="/" element={<Menu />} />
			<Route path="*" element={<Page404 />} />
		</Routes>
	);
}
