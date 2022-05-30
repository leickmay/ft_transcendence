import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { UserPreview } from "../../app/interfaces/User";
import { PacketPlayInSearchUserResults } from "../../app/packets/PacketPlayInSearchUserResults";
import { PacketPlayOutFriends } from "../../app/packets/PacketPlayOutFriends";
import { PacketPlayOutSearchUserRequest } from "../../app/packets/PacketPlayOutSearchUserRequest";
import { RootState } from "../../app/store";
import { FriendCard } from "../components/FriendCard";

export const Friends = () => {
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);
	const friends = useSelector((state: RootState) => state.users.friends);
	const [searchInputValue, setSearchInputValue] = useState<string>('');
	const [results, setResults] = useState<Array<UserPreview>>([]);

	useEffect(() => {
		socket?.off('search').on('search', (packet: PacketPlayInSearchUserResults) => {
			setResults(packet.results);
		});
	}, [socket]);

	const addFriend = useCallback((target: number) => {
		socket?.emit('user', new PacketPlayOutFriends("add", target));
	}, [socket]);

	const canAdd = useCallback((target: number): boolean => {
		return user?.id !== target && !friends.find(f => f.id === target);
	}, [friends, user]);

	const updateResults = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
		setSearchInputValue(evt.target.value);
		if (evt.target.value) {
			socket?.emit('search', new PacketPlayOutSearchUserRequest(evt.target.value));
		} else {
			setResults([]);
		}
	}, [socket]);

	return (
		<div id="friends">
			<section>
				<div className="add-friend">
					<h3>Add friend</h3>
					<input type="text" autoComplete="off" name="search" className="border-primary" placeholder="Search for a login" value={searchInputValue} onChange={updateResults} />
					<ul>
						{results.map(u =>
							<li key={u.id}>
								<span>{u.name} <small>{u.login}</small></span>
								{canAdd(u.id) &&
									<button onClick={() => addFriend(u.id)}>add friend</button>
								}
							</li>
						)}
					</ul>
				</div>
				<div className="friends">
					<h3>Friends</h3>
					{friends.map(f =>
						<FriendCard key={f.id} user={f} />
					)}
				</div>
			</section>
		</div>
	);
};
