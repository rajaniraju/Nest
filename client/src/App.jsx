import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
			</Routes>
			<Routes>
				<Route path='/about' element={<About />} />
			</Routes>
			<Routes>
				<Route path='/profile' element={<Profile />} />
			</Routes>
			<Routes>
				<Route path='/signIn' element={<SignIn />} />
			</Routes>
			<Routes>
				<Route path='/signUp' element={<SignUp />} />
			</Routes>
		</BrowserRouter>
	);
}
