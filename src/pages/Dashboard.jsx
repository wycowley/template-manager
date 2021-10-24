import { app } from "../firebase.js";
import { getAuth } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, orderBy, query, setDoc, addDoc, collection, getFirestore, getDocs, updateDoc } from "firebase/firestore";

import { useEffect, useState } from "react";
import FolderViewer from "../components/FolderViewer.jsx";
import "../styles/Dashboard.css";

const auth = getAuth();
const db = getFirestore();
const Dashboard = (props) => {
    const [user, loading, error] = useAuthState(auth);
    const [totalData, setData] = useState({});
    useEffect(() => {
        if (!loading) {
            retrieveFirebaseFiles();
        }
    }, [loading]);
    async function retrieveFirebaseFiles() {
        const userRef = doc(db, "users", user.uid);
        const q = query(collection(userRef, "folders"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const temporaryData = {};
        querySnapshot.forEach((doc) => {
            temporaryData[doc.id] = doc.data();
        });
        console.log(temporaryData);
        setData(temporaryData);
    }
    return (
        <div className='dashboard-container'>
            <h1 style={{ textDecoration: "underline" }}>Recent Templates</h1>
            <div className='folder-container'>
                {Object.keys(totalData).map((id) => {
                    return <FolderViewer name={totalData[id].name} id={id} userId={user.uid} timestamp={totalData[id].timestamp}></FolderViewer>;
                })}
            </div>
        </div>
    );
};
export default Dashboard;
