import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import { SignIn } from './components/signin';
import { Hey } from './pages/hey';
import { Home } from './pages/home';
import { Loading } from './pages/loading';

function App() {
  return (
	<div className="App">
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/loading" element={<Loading />} />
				<Route path="/hey" element={<Hey />} />
			</Routes>
		</BrowserRouter>
	</div>
  );
}

export default App;
