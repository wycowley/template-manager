import app from "../firebase.js";
import { FaFolder } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/NavBar.css";
const auth = getAuth();
const NavBar = (props) => {
    let history = useHistory();
    const [user, loading, error] = useAuthState(auth);

    function signOutUser() {
        signOut(auth)
            .then(() => {
                history.push("/signin");
            })
            .catch((error) => {
                // An error happened.
            });
    }
    return (
        <div className='top-nav'>
            <FaFolder className='icon'></FaFolder>
            <h2 class='no-hover'>Template Manager</h2>
            <Link to='/dashboard' style={{ color: "black" }}>
                <h2>Home</h2>
            </Link>
            <Link to='/create' style={{ color: "black" }}>
                <h2>Create New</h2>
            </Link>
            <div className='profile-section'>
                <button onClick={signOutUser} className='sign-out'>
                    <h2 className='non-default-h2'>Sign Out</h2>
                </button>
                {!loading && user != undefined ? (
                    <div className='profile-img-container'>
                        <img src={user.photoURL} className='profile-image'></img>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};
export default NavBar;
