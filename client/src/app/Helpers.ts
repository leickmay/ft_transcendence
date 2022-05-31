import { NavigateFunction } from "react-router";
import { CookieSetOptions } from "universal-cookie";

export function logout(removeCookie: (name: any, options?: CookieSetOptions | undefined) => void, navigate: NavigateFunction) {
	removeCookie('access_token');
	navigate('/login');
}
