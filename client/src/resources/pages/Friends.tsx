import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../app/context/socket";
import { User } from "../../app/interfaces/User";
import { RootState } from "../../app/store";
import FriendCard from "../components/FriendCard";

export const Friends = () => {
	const user = useSelector((state: RootState) => state.users.current);
	const online = useSelector((state: RootState) => state.users.online);

	const getOnlineFriends: () => Array<User> = () => {
		return user?.friends?.filter(value => online.includes(value)) || [];
	};

	const onlineFriends: () => Array<JSX.Element> = () => {
		let elements: Array<JSX.Element> = [];
		for (const element of getOnlineFriends()) {
			elements.push(<FriendCard key={element.id} user={element} />);
		}
		return elements;
	};

	const connected: () => Array<JSX.Element> = () => {
		let elements: Array<JSX.Element> = [];
		for (const element of online) {
			elements.push(<FriendCard key={element.id} user={element} />);
		}
		return elements;
	};

	return (
		<div>
			{ onlineFriends() }
			<div style={{ height: '8px', width: '100vw', backgroundColor: 'yellow' }}></div>
			{ connected() }
		</div>
	);
};
