import React, { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { alertType } from "../../app/slices/alertSlice";
import store, { RootState } from "../../app/store";

export function ImageUploader() {
	const [selectedFile, setSelectedFile] = useState<File>();
	const [cookies] = useCookies();
	const [img, setImg] = useState("");
	const user = useSelector((state: RootState) => state.users.current);

	const getHeaders = useCallback(async (): Promise<HeadersInit> => {
		const token = await cookies.access_token;

		return {
			'Authorization': 'Bearer ' + token
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
			formData.set('file', selectedFile);
			const headers = await getHeaders();

			await fetch("/api/users/avatar/", {
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

	useEffect(() => {
		const fetchImage = async () => {
			const headers = await getHeaders();
			const res = await fetch("/api/users/avatar/" + user?.login, {method: "GET", headers: headers});
			if (res.ok)
			{
				const imageBlob = await res.blob();
				const imageObjectURL = URL.createObjectURL(imageBlob);
				setImg(imageObjectURL);
			}
		}
		
		fetchImage();
	}, [getHeaders, user?.login])

	return (
		<div>
			<input type="file" name="image" onChange={changeHandler} />
			{(selectedFile) ? (
				<div>
					<p>Image to upload : {selectedFile.name} </p>
				</div>
			) : (
				<div>
					<p>Select an image to upload (PNG or JPEG)</p>
				</div>
			)}
			<div>
				<button onClick={handleSubmission}>Submit</button>
			</div>
			{
				img !== "" ? (
					<img src={img} alt="avatar" />
				) : (
				 <p> no avatar</p>
				)
			}
			
		</div>
	)
}
