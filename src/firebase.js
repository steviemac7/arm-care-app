import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA7V32fwzwzJQF1lWc_SYBwcwhA_FN8xEA",
    authDomain: "arm-care-app.firebaseapp.com",
    projectId: "arm-care-app",
    storageBucket: "arm-care-app.firebasestorage.app",
    messagingSenderId: "431275718878",
    appId: "1:431275718878:web:c486c7e982b4f5907d2a4f",
    measurementId: "G-63MZNSNTMF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
