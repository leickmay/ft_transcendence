//import { useHistory ,useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const Home = () => {
	const user = useSelector((state: any) => state.userReducer);

	var inputName: string = "";

	useEffect(() => {
		console.log("user in Home : ",  user);
	}, []);

	const handleInput = (input: string) => {
		inputName = input;
	};

	async function test (which: number) {


		if (which === 1)
		{
			var input: any = document.getElementById("input");
			input.value = "";
		}
		else if (which === 2)
		{

		}
	};

	return (
		<div>
			<Navigation userCard={user} />
			<div className="home">
				<input id='input' onChange={(e) => handleInput(e.target.value)} placeholder='type input for test 1'></input>
				<button type='submit' onClick={() => {test(1)}}>test 1</button>
				<button type='submit' onClick={() => {test(2)}}>test 2</button>
			</div>
		</div>
	);
};

export default Home;
