import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setTabSmallScreen } from "../../../app/slices/chatSlice";
import { RootState } from "../../../app/store";

export const ChatButtonNav = () => {
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
	const tab = useSelector((state: RootState) => state.chat.tabSmallScreen);

	const getNameButton = () => {
		if (tab === 0)
			return ("Settings");
		else
			return ("Chat");
	}

	return (
		<button id={"buttonNav"} onClick={() => {
				if (tab !== 0)
					dispatch(setTabSmallScreen(0));
				else
					dispatch(setTabSmallScreen(1));
			}}
		>
			{getNameButton()}
		</button>
	);
};
