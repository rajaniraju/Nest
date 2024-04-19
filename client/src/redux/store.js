import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/user/userSlice.js";
export const store = configureStore({
	reducer: {
		user: userReducer,
	},
	//added to prevent any error in the browser.
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: false,
		});
	},
});
