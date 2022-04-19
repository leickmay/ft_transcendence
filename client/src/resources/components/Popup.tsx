import React from 'react';

const Popup = ( {popupData}: any) => {
	return (
		<div className='popup'>
			<div className={popupData[1]}>
				{popupData[0]}
			</div>
		</div>
	);
};

export default Popup;