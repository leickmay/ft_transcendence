import React from 'react';

const TestFriendCard = () => {
	return (
		<div className='testFriendCard'>
			<img
				src={
				"./assets/avatars/avatar1.png"
				? "./assets/avatars/avatar1.png"
				: "./img/poster.jpg"}
        		alt="affiche film" />
			<button>test</button>
		</div>
	);
};

export default TestFriendCard;