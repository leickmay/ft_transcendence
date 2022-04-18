import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

export const createSocket = (headers: HeadersInit): any => {
	return (dispatch: Dispatch<AnyAction>, getState: any) => {
		const socket: Socket = io({extraHeaders: headers as any});
		dispatch(setSocket(socket));
	};
};
