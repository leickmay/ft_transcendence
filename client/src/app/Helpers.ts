import { NavigateFunction } from "react-router";
import { Socket } from "socket.io-client";
import { CookieSetOptions } from "universal-cookie";

export function logout(removeCookie: (name: any, options?: CookieSetOptions | undefined) => void, navigate: NavigateFunction, socket?: Socket) {
	removeCookie('access_token');
	socket?.disconnect();
	navigate('/login');
}
