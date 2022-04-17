import { User } from "../../app/interfaces/User";

interface Props {
	user?: User;
}

export function UserCard(props: Props) {
	return (
		<p>{ props.user?.login || "Loading..." }</p>
	);
}
