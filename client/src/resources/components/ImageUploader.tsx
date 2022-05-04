import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { consumers } from "stream";
import { alertType } from "../../app/slices/alertSlice";
import store from "../../app/store";

export function ImageUploader() {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [cookies] = useCookies();

	async function getHeaders() {
		
		const token = await cookies.access_token;
		return {
			'Authorization': 'Bearer ' + token
		};
	};

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filelist = e.target.files;
        if (filelist)
        {
            setSelectedFile(filelist[0]);
        }
    }

    const handleSubmission = async () => {
        let formData = new FormData();

        if (!selectedFile)
        {
            store.dispatch(alertType("File is missing !"));
        }
        else if (selectedFile.size > 2000000)
        {
            store.dispatch(alertType("File size is limited to 2MB"));
        }
        else if (selectedFile.type !== 'image/png')
        {
            store.dispatch(alertType("Image type is not PNG"));
        }
        else
        {
            formData.set('file', selectedFile);
            const headers = await getHeaders();
            await fetch("api/users/uploadimage/", {
                method: "POST",
                headers: headers,
                body: formData,
            }
            ).then((response) => {
                if (response.ok)
                {
                    store.dispatch(alertType("Avatar succesfully uploaded"));
                }
                else {
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
            <input type="file" name="image" onChange={changeHandler} />
            {(selectedFile) ? (
                <div>
                    <p>Image to upload : {selectedFile.name} </p>
                </div>
            ) : (
                <div>
                    <p>Select an image to upload (PNG)</p>
                </div>
            )}
            <div>
                <button onClick={handleSubmission}>Submit</button>
            </div>
        </div>
    )
}