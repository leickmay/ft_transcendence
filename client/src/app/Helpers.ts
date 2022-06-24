import { useEffect, useRef } from "react";
import { NavigateFunction } from "react-router";
import { Socket } from "socket.io-client";
import { CookieSetOptions } from "universal-cookie";

export const logout = (removeCookie: (name: any, options?: CookieSetOptions | undefined) => void, navigate: NavigateFunction, socket?: Socket) => {
	removeCookie('access_token');
	socket?.disconnect();
	navigate('/login');
}

export const useAnimationFrame = (callback: (delta: number) => void, deps?: React.DependencyList | undefined) => {
	const requestRef = useRef<number>();
	const previousTimeRef = useRef<number>();

	useEffect(() => {
		const animate = (time: number) => {
			if (previousTimeRef.current !== undefined) {
				const deltaTime = time - previousTimeRef.current;
				callback(deltaTime)
			}
			previousTimeRef.current = time;
			requestRef.current = requestAnimationFrame(animate);
		}

		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current || 0);
	}, [deps, callback]);
}
