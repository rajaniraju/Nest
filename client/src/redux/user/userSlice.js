import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentUser: null,
	error: null,
	loading: false,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		// Redux Toolkit allows us to write "mutating" logic in reducers. It
		// doesn't actually mutate the state because it uses the Immer library,
		// which detects changes to a "draft state" and produces a brand new
		// immutable state based off those changes
		signInStart: (state) => {
			state.loading = true;
		},
		signInSucess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = null;
		},
		signInFailure: (state, action) => {
			state.currentUser = action.payload;
			state.loading = true;
		},
		updateUserStart: (state) => {
			state.loading = true;
		},
		updateUserSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = null;
		},
		updateUserFailure: (state, action) => {
			state.error = action.payload;
			state.loading = true;
		},
		deleteUserStart: (state) => {
			state.loading = true;
		},
		deleteUserSuccess: (state) => {
			state.currentUser = null;
			state.loading = false;
			state.error = null;
		},
		deleteUserFailure: (state, action) => {
			state.error = action.payload;
			state.loading = true;
		},
		signOutUserStart: (state) => {
			state.loading = true;
		},
		signOutUserSuccess: (state) => {
			state.currentUser = null;
			state.loading = false;
			state.error = null;
		},
		signOutUserFailure: (state, action) => {
			state.error = action.payload;
			state.loading = true;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	signInStart,
	signInSucess,
	signInFailure,
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	deleteUserFailure,
	signOutUserStart,
	signOutUserSuccess,
	signOutUserFailure
} = userSlice.actions;

export default userSlice.reducer;
