// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyATNn2F0KJSKE75CEonDPtY3Q9OVZXodm0",
    authDomain: "template-manager-4f0cc.firebaseapp.com",
    projectId: "template-manager-4f0cc",
    storageBucket: "template-manager-4f0cc.appspot.com",
    messagingSenderId: "558222395374",
    appId: "1:558222395374:web:44e98352458d99ba93b0ff",
    measurementId: "G-73KRE4N508",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
