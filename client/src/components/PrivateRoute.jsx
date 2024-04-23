import { useSelector } from "react-redux";
//the following is to show the children of the route in app.jsx.
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
	const { currentUser } = useSelector((state) => state.user);
	return currentUser ? <Outlet /> : <Navigate to='./signIn' />;
}
