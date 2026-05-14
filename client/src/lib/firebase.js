// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "website-builder-56993.firebaseapp.com",
    projectId: "website-builder-56993",
    storageBucket: "website-builder-56993.firebasestorage.app",
    messagingSenderId: "657893466707",
    appId: "1:657893466707:web:5168b148959f71fa879ca6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };