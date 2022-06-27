import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/SocketContext";
import { PacketPlayOutFriends } from "../../app/packets/PacketPlayOutFriends";
import { PacketPlayOutSearchUserRequest } from "../../app/packets/PacketPlayOutSearchUserRequest";
import { RootState } from "../../app/store";
import { FriendCard } from "../components/FriendCard";

export const Friends = () => {
	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.users.current);
	const friends = useSelector((state: RootState) => state.users.friends);
	const results = useSelector((state: RootState) => state.users.results);
	const [searchInputValue, setSearchInputValue] = useState<string>('');
	const rooms = useSelector((state: RootState) => state.chat.rooms);

	useEffect(() => {
		if (!rooms || rooms.length === 0) {
			socket?.emit('reload');
		}
	}, [socket, rooms]);

	const addFriend = useCallback((target: number) => {
		socket?.emit('user', new PacketPlayOutFriends("add", target));
	}, [socket]);

	const canAdd = useCallback((target: number): boolean => {
		return user?.id !== target && !friends.find(f => f.id === target);
	}, [friends, user]);

	const updateResults = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
		setSearchInputValue(evt.target.value);
		if (evt.target.value) {
			socket?.emit('user', new PacketPlayOutSearchUserRequest(evt.target.value));
		}
	}, [socket]);

	return (
		<div id="friends" className='container'>
			<section className="add-friend">
				<h3>Add friend</h3>
				<input type="text" autoComplete="off" name="search" className="border-primary" placeholder="Search for a login" value={searchInputValue} onChange={updateResults} />
				<ul>
					{searchInputValue && results.map(u =>
						<li key={u.id}>
							<span>{u.name} <small>{u.login}</small></span>
							<button style={{ visibility: canAdd(u.id) ? undefined : 'hidden' }} className="button-hovered" onClick={() => addFriend(u.id)}>add</button>
						</li>
					)}
				</ul>
			</section>
			<section className="friends">
				<h3>Friends</h3>
				<div>
					{friends.map(f =>
						<FriendCard key={f.id} user={f} />
					)}
				</div>
			</section>
		</div>
	);
};
