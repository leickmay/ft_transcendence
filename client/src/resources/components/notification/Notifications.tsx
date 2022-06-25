import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { NotificationElement } from "./Notification";

interface Props {
}

export const Notifications = (props: Props) => {
	const notifications = useSelector((state: RootState) => state.notifications.actives);

	return (
		<div id="notifications">
			{notifications.map(n =>
				<NotificationElement key={n.id} id={n.id} visible={n.visible} content={n.content}></NotificationElement>
			)}
		</div>
	)
}
