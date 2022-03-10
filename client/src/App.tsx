import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import { SignIn } from './components/signin';
import { Home } from './pages/home';
import { Loading } from './pages/loading';

function App() {
  return (
	<div className="App">
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/loading" element={<Loading />} />
			</Routes>
		</BrowserRouter>
	</div>
  );
}

export default App;
