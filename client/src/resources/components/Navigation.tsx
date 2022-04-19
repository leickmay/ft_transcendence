import { NavLink } from "react-router-dom";
import UserCard from "./UserCard";

interface Props {
}

const Navigation = (props: Props) => {
	return (
		<div id="navigation">
			<UserCard />
			<nav>
				<NavLink end to="/" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>Home</NavLink>
				<NavLink end to="/game" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>Game</NavLink>
				<NavLink end to="/friends" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>Friends</NavLink>
				<NavLink end to="/statistics" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>Statisitcs</NavLink>
				<NavLink end to="/history" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>History</NavLink>
				<NavLink end to="/options" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>Options</NavLink>
			</nav>
		</div>
	);
};

export default Navigation;