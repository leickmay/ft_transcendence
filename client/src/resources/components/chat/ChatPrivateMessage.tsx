import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import store from "../../../app/store";
import { hideDivById } from "../../pages/Chat";

export const switchConfigPrivMsg = () => {
	hideDivById("chatNavigation");
	hideDivById("chatPrivateMessage");
}

const ChatPrivateMessage = () => {

	const [usersOnline, setUsersOnline] = useState(store.getState().users.online);

	const alertUsersOnline = useSelector(() => store.getState().users.online);

	useEffect(() => {
		setUsersOnline(store.getState().users.online);
	}, [alertUsersOnline]);

	return (
		<div
			id="chatPrivateMessage"
			className="chatLeft"
			style={{display: "none"}}
		>
			<button
				onClick={() => {
					switchConfigPrivMsg();
				}}
			>..</button>
			<h2>Players Online</h2>
			{/* {
				usersOnline.map((value, index) => {
					return (
						<div key={index}>
							+ {value.login}
						</div>
					)
				})
			} */}
		</div>
	);
};
