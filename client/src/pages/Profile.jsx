import React from "react";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
// firebase coede for rules (inside storage.service firebase.storage {
/* match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if
      request.resource.size <2*1024*1024 &&
      request.resource.contentType.matches('image/.*')
    }
  }
}*/

//here useRef helps not to show choosefile / no filechoosen instead when the image is clicked the file should be imported.
export default function Profile() {
	const fileRef = useRef(null);
	const { currentUser, loading, error } = useSelector((state) => state.user);
	const [file, setFile] = useState(undefined);
	const [filepercent, setFilepercent] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [formData, setFormData] = useState({});
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const dispatch = useDispatch();
	console.log(formData);
	console.log(filepercent);
	console.log(fileUploadError);
	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);
	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilepercent(Math.round(progress));
			},
			(error) => {
				setFileUploadError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					setFormData({ ...formData, avatar: downloadURL })
				);
			}
		);
	};
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
				return;
			}
			dispatch(updateUserSuccess(data));
			setUpdateSuccess(true);
		} catch (error) {
			dispatch(updateUserFailure(error.message));
		}
	};

	return (
		<div className='p-3 max-w-lg mx-auto'>
			<h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<input
					onChange={(e) => {
						setFile(e.target.files[0]);
					}}
					type='file'
					ref={fileRef}
					hidden
					accept='image/*'></input>
				<img
					onClick={() => {
						fileRef.current.click();
					}}
					className='rounded-full h-24 w-24  object-cover cursor-pointer self-center mt-2'
					src={formData.avatar || currentUser.avatar}
					alt='profile'></img>
				<p className='text-sm self-center'>
					{fileUploadError ? (
						<span className='text-red-700'>
							Error! image was not uploaded (Image must be less than 2mb)
						</span>
					) : filepercent > 0 && filepercent < 100 ? (
						<span className='text-slate-700'>{`Uploading ${filepercent}`}</span>
					) : filepercent === 100 ? (
						<span className='text-green-700'>
							Image successfully Uploaded!
						</span>
					) : (
						" "
					)}
				</p>
				<input
					type='text'
					placeholder='username'
					className='border p-3 rounded-lg'
					defaultValue={currentUser.username}
					id='username'
					onChange={handleChange}></input>
				<input
					type='email'
					placeholder='email'
					className='border p-3 rounded-lg'
					defaultValue={currentUser.email}
					id='email'
					onChange={handleChange}></input>
				<input
					type='password'
					placeholder='password'
					className='border p-3 rounded-lg'
					id='password'
					onChange={handleChange}></input>
				<button
					disabled={loading}
					className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
					{loading ? "Loading..." : "Update"}
				</button>
			</form>
			<div className='flex justify-between mt-5'>
				<span className='text-red-700 cursor-pointer'>Delete Account</span>
				<span className='text-red-700 cursor-pointer'>Sign out</span>
			</div>
			<p className='text-red-700 mt-5'>{error ? error : ""}</p>
			<p className='text-green-700 mt-5'>
				{updateSuccess ? "User is updated successfully!" : ""}
			</p>
		</div>
	);
}
