import React, { useCallback, useState } from "react";
import { useCookies } from "react-cookie";
import { alertType } from "../../app/slices/alertSlice";
import store from "../../app/store";

export function ImageUploader() {
	const [selectedFile, setSelectedFile] = useState<File>();
	const [cookies] = useCookies();

	const getHeaders = useCallback(async (): Promise<HeadersInit> => {
		const token = cookies.access_token;

		return {
			'Authorization': 'Bearer ' + token,
		};
	}, [cookies]);

	const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const filelist = e.target.files;
		if (filelist) {
			setSelectedFile(filelist[0]);
		}
	}

	const handleSubmission = async () => {
		let formData = new FormData();

		if (!selectedFile) {
			store.dispatch(alertType("File is missing !"));
		} else if (selectedFile.size > 2000000) {
			store.dispatch(alertType("File size is limited to 2MB"));
		} else if (selectedFile.type !== 'image/png' && selectedFile.type !== 'image/jpeg') {
			store.dispatch(alertType("Please upload a PNG or JPEG image only"));
		} else {
			formData.set('avatar', selectedFile);
			const headers = await getHeaders();

			await fetch("/api/users/avatar", {
				method: "POST",
				headers: headers,
				body: formData,
			}).then((response) => {
				if (response.ok) {
					store.dispatch(alertType("Avatar succesfully uploaded"));
				} else {
					store.dispatch(alertType("Avatar upload failed"));
				}
			})
			.catch((error) => {
				console.log("Error : ", error);
			});
		}
	}

	return (
		<div>
			<input type="file" accept="image/png,image/jpeg" name="image" onChange={changeHandler} />
			<div>
				{(selectedFile) ? (
					<p>Image to upload : {selectedFile.name} </p>
				) : (
					<p>Select an image to upload (PNG or JPEG)</p>
				)}
			</div>
			<div>
				<button onClick={handleSubmission}>Submit</button>
			</div>
		</div>
	)
}
