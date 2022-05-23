import React, { useCallback } from "react";
import { useCookies } from "react-cookie";
import { alertType } from "../../app/slices/alertSlice";
import store from "../../app/store";

export function ImageUploader() {
	const [cookies] = useCookies();

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
			store.dispatch(alertType("File is missing !"));
		} else if (file.size > 2000000) {
			store.dispatch(alertType("File size is limited to 2MB"));
		} else if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
			store.dispatch(alertType("Please upload a PNG or JPEG image only"));
		} else {
			formData.set('avatar', file);

			await fetch("/api/users/avatar", {
				method: "POST",
				headers: await getHeaders(),
				body: formData,
			}).then((response) => {
				if (!response.ok) {
					store.dispatch(alertType("Avatar upload failed"));
				}
			}).catch((error) => {
				console.log("Error : ", error);
			});
		}
	}

	// var fileInput = document.querySelector(".input-file"),
	// the_return = document.querySelector(".file-return");

	// fileInput.addEventListener("change", function (event) {
	// 	the_return.innerHTML = this.value;
	// });

	return (
		<>
			<input id="avatar-select" accept="image/png,image/jpeg" type="file" onChange={submit} />
			<label htmlFor="avatar-select" className="pointer border-primary">
				Select an image (jpeg or png)
			</label>
		</>
	)
}
