import { useCookies } from "react-cookie";

const UserCard = ({ userCard }: any) => {
	const [cookies, setCookies, removeCookie] = useCookies();

	const logout = () => {
		removeCookie("access_token");
		window.open('http://127.0.0.1:80/connect', "_self");
	};

	return (
		<div className='userCard'>
			<img className='userCardAvatar' src={userCard.avatar} width="120px" alt=""></img>
			<div className='userCardInfo'> 
				<div>{ userCard.name }</div>
				<div>lvl { userCard.level }</div>
				<button type="submit" onClick={() => {logout()}}></button>
			</div>
		</div>
	);
};

export default UserCard;