import React from "react";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
	deleteUserStart,
	deleteUserSuccess,
	deleteUserFailure,
	signOutUserStart,
	signOutUserSuccess,
	signOutUserFailure,
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
	const [showListingsError, setshowListingsError] = useState(false);
	const [userListings, setUserListings] = useState([]);
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
	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};
	const handleSignout = async () => {
		try {
			dispatch(signOutUserStart());
			const res = await fetch("api/auth/signout");
			const data = await res.json();
			if (data.success === false) {
				dispatch(signOutUserFailure(data.message));
				return;
			}
			dispatch(signOutUserSuccess(data));
		} catch (error) {
			dispatch(signOutUserFailure(error.message));
		}
	};
	const handleShowListings = async () => {
		try {
			console.log(currentUser._id);
			setshowListingsError(false);
			const res = await fetch(`/api/user/listings/${currentUser._id}`);
			const data = await res.json();
			console.log(data);
			if (data.success === false) {
				setshowListingsError(true);
				return;
			}
			setUserListings(data);
			console.log(userListings);
			console.log(userListings[0]);
		} catch (error) {
			setshowListingsError(true);
		}
	};

	/*useEffect(() => {
		console.log(userListings);
		handleShowListings();
	}, []);*/
	const handleListingDelete = async (listingId) => {
		console.log(listingId);
		try {
			const res = await fetch(`/api/listing/delete/${listingId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				console.log(data.message);
				return;
			}
			setUserListings((prev) =>
				prev.filter((listing) => listing._id !== listingId)
			);
		} catch (error) {
			console.log(error.message);
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
				<Link
					className='bg-green-700  text-white rounded-lg p-3 uppercase text-center hover:opacity-95 disabled:opacity-80'
					to={"/createListing"}>
					Create Listing
				</Link>
			</form>
			<div className='flex justify-between mt-5'>
				<span
					onClick={handleDeleteUser}
					className='text-red-700 cursor-pointer'>
					Delete Account
				</span>
				<span
					onClick={handleSignout}
					className='text-red-700 cursor-pointer'>
					Sign out
				</span>
			</div>
			<p className='text-red-700 mt-5'>{error ? error : ""}</p>
			<p className='text-green-700 mt-5'>
				{updateSuccess ? "User is updated successfully!" : ""}
			</p>
			<button onClick={handleShowListings} className='text-green-700 w-full'>
				Show Listings
			</button>
			<p className='text-red-700 mt-5'>
				{showListingsError ? "Error showing listings" : ""}
			</p>
			{userListings && userListings.length > 0 && (
				<>
					<div className='flex flex-col gap-4'>
						<h1 className='text-center mt-7 text-2xl font-semibold'>
							Your Listings
						</h1>
					</div>
					{userListings.map((listing) => (
						<div
							key={listing._id}
							className='border rounded-lg p-3 flex justify-between items-center gap-4'>
							<Link to={`/listing/${listing._id}`}>
								<img
									src={listing.imageUrls[0]}
									alt='listing cover'
									className='h-16 w-16 object-contain'
								/>
							</Link>
							<Link
								className='flex-1 text-slate-700 font-semibold  hover:underline truncate'
								to={`/listing/${listing._id}`}>
								<p>{listing.name}</p>
							</Link>
							<div className='flex flex-col items-center'>
								<button
									onClick={() => handleListingDelete(listing._id)}
									className='text-red-700 uppercase'>
									Delete
								</button>
								<Link to={`/updateListing/${listing._id}`}>
									<button className='text-green-700 uppercase'>
										Edit
									</button>
								</Link>
							</div>
						</div>
					))}
				</>
			)}
		</div>
	);
}
