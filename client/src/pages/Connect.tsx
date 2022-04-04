import User from '../components/Interface';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/actions/user.actions';
import { registerUser, updateUser } from '../redux/actions/users.actions';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Connect = () => {


	const dispatch = useDispatch();
	const users = useSelector((state: any) => state.usersReducer);


	//const user = useSelector((state: any) => state.userReducer);



	var inputName: string;

	async function getClient(name: string) : Promise<User | undefined> {
		return users.filter((u: any) => u.name === name)[0];
	};

	const handleInput = (input: string) => {
		inputName = input;
	};

	const authEndpoint = 'https://api.intra.42.fr/oauth/authorize';

	const scopes = [
		'public',
	];
	const getAuthorizeHref = (): string => {
		const clientId = '32e445666f212da52b3a7811bf1ff13d37cfb105f4870eb38365337172af351a';
		const redirectUri = 'http://127.0.0.1:80/loading';
		return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=code`;
	}
	
		return (
			<div className='connect'>
				<button type='submit' onClick={() => window.open(getAuthorizeHref(),"_self")}>Sign in with 42</button>
				<button type='submit' onClick={() => window.open("https://www.youtube.com/watch?v=Sk-f-b2vbG4","_self")}>Sign in the Rain</button>
			</div>
		);


};

export default Connect;