import { useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { PacketPlayOutFriends } from "../../app/packets/packets";
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

	// ====== TMP ====== //
	const socket = useContext(SocketContext);
	const online = useSelector((state: RootState) => state.users.online);
	const connected: () => Array<JSX.Element> = () => {
		let elements: Array<JSX.Element> = [];
		for (const user of online.filter(o => !friends.find(f => f.id === o.id))) {
			elements.push(
			<div key={user.id}>
				<div onClick={() => socket?.emit('user', new PacketPlayOutFriends('add', user.id))}>
					<p className="pointer" style={{fontSize: '1rem'}}>{user.name} (ajouter)</p>
				</div>
			</div>);
		}
		return elements;
	};
	// ====== TMP ====== //

	return (
		<div>
			{ friendsComponents() }
			{/* // ====== TMP ====== // */}
			{ connected() }
			{/* // ====== TMP ====== // */}
		</div>
	);
};
