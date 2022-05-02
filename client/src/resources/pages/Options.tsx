import { KeyboardEvent, useState, useEffect } from 'react';
import { useCookies } from "react-cookie";

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
		try {
			await fetch("api/users/changelogin/" + name, {method: "POST", headers: headers});
		}
		catch {
			 console.log("This name already exists");
		}
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(`The name you entered was: ${name}`)
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
