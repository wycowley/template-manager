import "../styles/App.css";
import app from "../firebase.js";
import { HashRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import SignIn from "../components/SignIn.jsx";
import Navbar from "../components/NavBar.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Download from "../pages/Download.jsx";
import Create from "./Create.jsx";
import Edit from "./Edit.jsx";

const auth = getAuth();
function App() {
    const [user, loading, error] = useAuthState(auth);
    useEffect(() => {
        console.log(loading);
        console.log(user);
    }, [loading]);
    return (
        <Router>
            <Switch>
                <Route path='/signin'>
                    <SignIn></SignIn>
                </Route>
                <Route path='/dashboard'>
                    {!loading && user == undefined ? <Redirect to='signin'></Redirect> : <></>}
                    <Navbar></Navbar>
                    <Dashboard></Dashboard>
                </Route>
                <Route path='/create'>
                    <Create user={user}></Create>
                </Route>
                <Route path='/edit/:id'>
                    <Navbar></Navbar>
                    <Edit></Edit>
                </Route>
                <Route path='/download/:id/:userId'>
                    <Download></Download>
                </Route>
                <Route path='/'>{loading ? <h1>Loading...</h1> : user == undefined ? <Redirect to='/signin'></Redirect> : <Redirect to='dashboard'></Redirect>}</Route>
            </Switch>
        </Router>
    );
}

export default App;
