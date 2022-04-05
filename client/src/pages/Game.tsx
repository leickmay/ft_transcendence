import React from 'react';
import { useSelector } from 'react-redux';
import Navigation from '../components/Navigation';

const Game = () => {
	const user = useSelector((state: any) => state.userReducer);

	return (
		<div>
			<Navigation userCard={user}/>
			<div id='game' className='game' />
		</div>
	);
};

export default Game;