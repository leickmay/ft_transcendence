import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import FriendCard from "../components/FriendCard";

export const Friends = () => {
	const friends = useSelector((state: RootState) => state.users.friends);

	const friendsComponents: () => Array<JSX.Element> = () => {
		let elements: Array<JSX.Element> = [];
		
		for (const friend of friends) {
			elements.push(<FriendCard key={friend.id} user={friend} />);
		}
		return elements;
	};

	return (
		<div>
			{ friendsComponents() }
		</div>
	);
};
