
const UserCard = ({ userCard }: any) => {
	return (
		<div className='userCard'>
			<img className='userCardAvatar' src={userCard.avatar} width="120px" alt=""></img>
			<div className='userCardInfo'> 
				<div>{ userCard.name }</div>
				<div>lvl { userCard.level }</div>
			</div>
		</div>
	);
};

export default UserCard;