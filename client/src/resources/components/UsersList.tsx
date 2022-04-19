import { useSelector } from "react-redux";
import { User } from "../../app/interfaces/User";
import { RootState } from "../../app/store";
import { UserCard } from "./UserCard";

interface Props {
}

export function UsersList(props: Props) {
	const users: Array<User> = useSelector((state: RootState) => state.users.online);

	let rows: Array<JSX.Element> = users.map(u => <UserCard key={u.id} user={u} />);
	return (
		<ul>
			{rows}
		</ul>
	);
}
