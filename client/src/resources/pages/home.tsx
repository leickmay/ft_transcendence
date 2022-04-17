import { Route, Routes } from 'react-router-dom';
import { Menu } from './menu';
import { Page404 } from './Page404';
import { Provider } from 'react-redux';
import store from '../../app/store';

interface Props {
}

export function Home(props: Props) {
	return (
		<Provider store={store}>
			<Routes>
				<Route path="/" element={<Menu />} />
				<Route path="*" element={<Page404 />} />
			</Routes>
		</Provider>
	);
}
