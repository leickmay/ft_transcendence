import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import React, { useCallback } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { pushNotification } from "../../app/actions/notificationsActions";
import { RootState } from "../../app/store";

export const ImageUploader = () => {
	const [cookies] = useCookies();
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

	const getHeaders = useCallback(async (): Promise<HeadersInit> => {
		const token = cookies.access_token;

		return {
			'Authorization': 'Bearer ' + token,
		};
	}, [cookies]);

	const submit = async (e: React.ChangeEvent<HTMLInputElement>) => {
		let file = e.target.files?.[0];
		let formData = new FormData();

		if (!file) {
			dispatch(pushNotification('A file is required'));
		} else if (file.size > 2000000) {
			dispatch(pushNotification('The file size is limited to 2MB'));
		} else if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
			dispatch(pushNotification('Only images of type JPEG or PNG are accepted'));
		} else {
			formData.set('avatar', file);

			await fetch("/api/users/avatar", {
				method: "POST",
				headers: await getHeaders(),
				body: formData,
			}).then((response) => {
				if (!response.ok) {
					dispatch(pushNotification('Upload failed'));
				}
			}).catch((error) => {
				console.log("Error : ", error);
			});
		}
	}

	return (
		<>
			<input id="avatar-select" accept="image/png,image/jpeg" type="file" onChange={submit} />
			<label htmlFor="avatar-select" className="pointer border-primary">
				Select an image (jpeg or png)
			</label>
		</>
	)
}
