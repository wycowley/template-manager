import { app } from "../firebase.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Redirect } from "react-router-dom";
import { useState } from "react";
import "../styles/SignIn.css";
import GoogleButton from "react-google-button";

const provider = new GoogleAuthProvider();
const auth = getAuth();

const SignIn = (props) => {
    const [redirect, changeRedirect] = useState(false);
    function doSignIn() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                // ...
                changeRedirect(true);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }
    return (
        <div className='container'>
            <GoogleButton onClick={doSignIn} className='google-button'>
                Sign in with Google
            </GoogleButton>
            {redirect ? <Redirect to='/dashboard'></Redirect> : <></>}
        </div>
    );
};
export default SignIn;
