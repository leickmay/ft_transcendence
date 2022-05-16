import { NavLink } from "react-router-dom";
import { UserCard } from "./UserCard";
import '../scss/components/navigation.scss';

interface Props {
}

const Navigation = (props: Props) => {
	const routes = {
		'/': 'Home',
		'/game': 'Game',
		'/friends': 'Friends',
		'/chat': 'Chat',
		'/statistics': 'Statisitcs',
		'/history': 'History',
		'/options': 'Options',
	};

	return (
		<nav>
			<UserCard />
			<ul className="overlay border-purple">
				{Object.entries(routes).map(([route, name]) => (
					<li key={route}>
						<NavLink end to={route} className={({ isActive }) => "nav-link" + (isActive ? " activated text-neon-secondary" : " text-neon-primary")}>
							{name}
						</NavLink>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Navigation;