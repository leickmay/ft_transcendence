//import { useHistory ,useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useCookies } from "react-cookie";
import { Loading } from './Loading';
import { getUserById } from '../redux/actions/user.actions';
import { Navigate } from 'react-router-dom';

const Home = () => {
	const user = useSelector((state: any) => state.userReducer);
	const dispatch = useDispatch();
	const [cookies, setCookies] = useCookies();

	var inputName: string = "";

	useEffect(() => {
		console.log("Home...");	
		if (cookies.access_token)
		{

			console.log("LOAD DATA");
			loadData();
		}
		else if (!cookies.access_token)
		{
			console.log("redirect to connect");
			window.open('http://127.0.0.1:80/connect', "_self");
		}
	}, []);

	const loadData = async () => {
		let token = await cookies.access_token;
		if (token)
		{
			let pouic = await fetch("api/profile", {
				method: "GET",
				headers: {
					authorization: "Bearer " + token.access_token,
				}
			});
			let data = await pouic.json();
			dispatch(getUserById(data.userId, token.access_token));
		}
	}

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

	if (user)
		return (
			<div>
				<Navigation userCard={user} />
				<div className="home">
					<input id='input' onChange={(e) => handleInput(e.target.value)} placeholder='type input for test 1'></input>
					<button type='submit' onClick={() => {test(1)}}>test 1</button>
					<button type='submit' onClick={() => {test(2)}}>test 2</button>
					<input type="file"/>
				</div>
			</div>
		);
	else
	{
		return (
			<div>Chargement en cours</div>
		);	
	}
};

export default Home;
