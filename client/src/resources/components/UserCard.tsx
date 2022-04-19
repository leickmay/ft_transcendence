import { useSelector } from "react-redux";
import { User } from "../../app/interfaces/User";
import { RootState } from "../../app/store";

interface Props {
	user?: User;
}

export function UserCard(props: Props) {
	return (
		<p>{ props.user?.login || "Loading..." }</p>
	);
}
