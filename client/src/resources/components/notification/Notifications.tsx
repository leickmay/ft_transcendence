import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { Notification } from "./Notification";

interface Props {
}

export const Notifications = (props: Props) => {
	const notifications = useSelector((state: RootState) => state.notifications.actives);

	return (
		<div id="notifications">
			{notifications.map(n => (
				<Notification key={n.id} visible={n.visible} text={n.message}></Notification>
			))}
		</div>
	)
}
