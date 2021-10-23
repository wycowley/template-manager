import { app } from "../firebase.js";
import { doc, getFirestore, getDoc, getDocs, collection, query, querySnapshot } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
const db = getFirestore();

const Dashboard = (props) => {
    let { id } = useParams();
    let { userId } = useParams();
    const [folderTitle, setFolderTitle] = useState("Loading");
    const [totalData, setTotalData] = useState({});

    useEffect(() => {
        console.log(id, userId);
        getFirebaseData();
    }, []);
    async function getFirebaseData() {
        const userRef = doc(db, "users", userId);
        const folderRef = doc(userRef, "folders", id);
        const folderMetaData = await getDoc(folderRef);

        const q = query(collection(folderRef, "files"));
        console.log(q);
        const querySnapshot = await getDocs(q);
        var x = 0;
        var totalDataTemporary = {};
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            totalDataTemporary[doc.id] = doc.data();
            console.log(doc.id, " => ", doc.data());
            x++;
        });
        setTotalData(totalDataTemporary);
        console.log("Set state");
        console.log(totalData);
    }
    function downloadEverything() {
        var FileSaver = require("file-saver");
        Object.keys(totalData).forEach((id) => {
            var blob = new Blob([totalData[id].data], { type: "text/plain;charset=utf-8" });
            FileSaver.saveAs(blob, [totalData[id].name]);
        });
    }
    return (
        <div>
            <h1>Warning: You are about to download the following files:</h1>
            <Link to='/home'>Return back to homepage</Link>
            {Object.keys(totalData).map((id) => {
                return (
                    <div>
                        <p>{totalData[id].name}</p>
                        <span></span>
                    </div>
                );
            })}
            <button onClick={downloadEverything}>Download All</button>
        </div>
    );
};

export default Dashboard;
