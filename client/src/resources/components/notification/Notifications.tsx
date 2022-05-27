import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { Notification } from "./Notification";

interface Props {
}

export const Notifications = (props: Props) => {
	const notifications = useSelector((state: RootState) => state.notifications.visibles);

	return (
		<div id="notification" style={{
			position: 'fixed',
			right: 0,
			top: 0,
		}}>
			{
				notifications.map(n => (<Notification key={n.id} text={n.message}></Notification>))
			}
		</div>
	)
}
