import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { UserPreview } from "../../app/interfaces/User";
import { PacketPlayInSearchUserResults } from "../../app/packets/PacketPlayInSearchUserResults";
import { PacketPlayOutSearchUserRequest } from "../../app/packets/PacketPlayOutSearchUserRequest";
import { RootState } from "../../app/store";
import { FriendCard } from "../components/FriendCard";

export const Friends = () => {
	const socket = useContext(SocketContext);
	const friends = useSelector((state: RootState) => state.users.friends);
	const [searchInputValue, setSearchInputValue] = useState<string>('');
	const [results, setResults] = useState<Array<UserPreview>>([]);

	const friendsComponents: () => Array<JSX.Element> = () => {
		let elements: Array<JSX.Element> = [];

		for (const friend of friends) {
			elements.push(<FriendCard key={friend.id} user={friend} />);
		}
		return elements;
	};

	useEffect(() => {
		socket?.off('search').on('search', (packet: PacketPlayInSearchUserResults) => {
			setResults(packet.results);
		});
	}, [socket]);

	const updateResults = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
		setSearchInputValue(evt.target.value);
		if (evt.target.value) {
			socket?.emit('search', new PacketPlayOutSearchUserRequest(evt.target.value));
		}
	}, [socket]);

	return (
		<div id="friends">
			<section>
				<div className="add-friend">
					<h3>Add friend</h3>
					<input type="text" name="search" className="border-primary" placeholder="Search for a login" value={searchInputValue} onChange={updateResults} />
					<ul>
						{results.map(u =>
							// @ts-ignore
							<li>{u.name} <small>{u.login}</small><span className={u.online ? 'online' : 'offline'}>•</span><button>add friend</button></li>
						)}
					</ul>
				</div>
				<div className="friends">
					<h3>Friends</h3>
					{friendsComponents()}
				</div>
			</section>
		</div>
	);
};
