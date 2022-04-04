import { NavLink } from "react-router-dom";
import UserCard from "./UserCard";

const Navigation = ( {userCard}: any ) => {
	return (
		<div className="navigation">
			<UserCard userCard={userCard}/>
			<div className="navBar">
				<NavLink to="/home" className="nav-active">Home</NavLink>
				<NavLink to="/game" className="nav-active">Game</NavLink>
				<NavLink to="/friends" className="nav-active">Friends</NavLink>
				<NavLink to="/statistics" className="nav-active">Statisitcs</NavLink>
				<NavLink to="/history" className="nav-active">History</NavLink>
				<NavLink to="/options" className="nav-active">Options</NavLink>
			</div>
		</div>
	);
};

export default Navigation;