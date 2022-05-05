import {  useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { alertType } from '../../app/slices/alertSlice';
import { setCurrentUser } from '../../app/slices/usersSlice';
import { User } from "../../app/interfaces/User";
import store, { RootState } from '../../app/store';
import Alert from '../components/Alert';
import { useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ImageUploader } from '../components/ImageUploader';
import { blob } from 'stream/consumers';

export const Options = () => {

	const [name, setName] = useState("");
	const [cookies] = useCookies();
	const user = useSelector((state: RootState) => state.users.current);
	const [img, setImg] = useState("");

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
