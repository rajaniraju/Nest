// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "nest-72b2a.firebaseapp.com",
	projectId: "nest-72b2a",
	storageBucket: "nest-72b2a.appspot.com",
	messagingSenderId: "501882370296",
	appId: "1:501882370296:web:c8f4f9d7e0ce15c47a230d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
