import {  useState } from 'react';
import { useCookies } from "react-cookie";
import { alertType } from '../../app/slices/alertSlice';
import store from '../../app/store';

import { ImageUploader } from '../components/ImageUploader';

export const Options = () => {

	const [name, setName] = useState("");
	const [cookies] = useCookies();

	async function getHeaders() {
		
		const token = await cookies.access_token;
		return {
			'Authorization': 'Bearer ' + token
		};
	};

	const changeLoginApi = async() => {
		const headers = await getHeaders();
		fetch("api/users/changelogin/" + name, {method: "POST", headers: headers})
			.then(res => {
				if (!res.ok)
				{
					store.dispatch(alertType("This username is already taken"));
					throw new Error('Already exists');
				}
			})
			.catch((e) => console.log("error : ", e));
			
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (name !== "")
		{
			changeLoginApi();
		}
	  }

	return (
		<div className='options'>
			<div className='optionsWindow'>
				<div className='optionsAvatar'>
					
					<div className='title'> 
						Choose your Avatar 
					</div>
					<ImageUploader />
					<div className='title'> 
						Change your username 
					</div>
					<form onSubmit={handleSubmit}>
		  <label>Enter your name:
			<input 
			  type="text" 
			  value={name}
			  onChange={(e) => setName(e.target.value)}
			/>
		  </label>
		  <input type="submit" />
		</form>


					

				</div>
			</div>
		</div>
	);
};
