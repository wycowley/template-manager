import { app } from "../firebase.js";
import { getAuth } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, query, getDoc, setDoc, addDoc, collection, getFirestore, getDocs, updateDoc, serverTimestamp } from "firebase/firestore";
import { FaDownload } from "react-icons/fa";
import { FaSave } from "react-icons/fa";

import { FaFolder } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DownloadLink from "react-download-link";

import DisplayFile from "../components/DisplayFile.jsx";

import "../styles/Edit.css";
const db = getFirestore();
const auth = getAuth();

const Edit = (props) => {
    const [user, loading, error] = useAuthState(auth);
    const [folderTitle, setFolderTitle] = useState("Loading...");
    const [totalData, setData] = useState({ saMPle: { data: "", name: "" } });
    const [mainDocRef, setDocRef] = useState({ id: 1 });
    const [changesPrompt, setChanges] = useState("All Changes Saved");
    const [changeFolderTitle, setChangeFolderTitle] = useState(false);
    const [visibleFile, setVisible] = useState(["Loading", { data: "Loading files...", name: "Loading..." }]);
    let { id } = useParams();

    useEffect(() => {
        if (!loading && user != undefined) {
            setDocRef(doc(doc(db, "users", user.uid), "folders", id));
            console.log(user.uid, id);
            console.log(mainDocRef);
            getDataFromFirestore();
        }
        return () => {
            uploadToFirebase();
        };
    }, [loading]);

    async function getDataFromFirestore() {
        console.log(mainDocRef);
        const mainDocData = await getDoc(doc(doc(db, "users", user.uid), "folders", id));
        setFolderTitle(mainDocData.data().name);
        const q = query(collection(doc(doc(db, "users", user.uid), "folders", id), "files"));
        console.log(q);
        const querySnapshot = await getDocs(q);
        var x = 0;
        var totalDataTemporary = {};
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            if (x == 0) {
                setVisible([doc.id, doc.data()]);
            }
            totalDataTemporary[doc.id] = doc.data();
            console.log(doc.id, " => ", doc.data());
            x++;
        });
        setData(totalDataTemporary);
        console.log(totalData);
    }
    function changeTitleForSelected(newTitle) {
        let object = visibleFile[1];
        object.name = newTitle;
        setVisible([visibleFile[0], object]);
        setChanges("Save all files");
    }
    function changeDataForSelected(newData) {
        let object = visibleFile[1];
        object.data = newData;
        setVisible([visibleFile[0], object]);
        setChanges("Save all files");
        // console.log(object.data);
    }
    function updateLocallyForSelected() {
        let copy = totalData;
        let localDocument = copy[visibleFile[0]];
        localDocument.data = visibleFile[1].data;
        localDocument.name = visibleFile[1].name;
        copy[visibleFile[0]] = localDocument;
        setData(copy);
    }
    function switchSelectedFile(newId) {
        console.log(newId);
        updateLocallyForSelected();
        setVisible([newId, totalData[newId]]);
    }
    function uploadToFirebase() {
        console.log("Starting upload process");
        updateLocallyForSelected();
        console.log(totalData);
        for (const id in totalData) {
            updateSingularDocument(id, totalData[id]);
        }

        setChanges("All changes saved");
        updateTimestamp();
        updateFolderTitleServer();

        console.log("Hopefully done with upload process");
    }
    async function updateTimestamp() {
        const updateTimestamp = await updateDoc(mainDocRef, {
            timestamp: serverTimestamp(),
        });
        console.log("Timestamp updated");
    }
    function addNewFile() {
        let copy = totalData;
        copy[Math.random() * 10000000000] = { name: "Untitled.FileExtension", data: "Copy code here" };
        setData({ ...copy });
        setChanges("Save all files");
    }
    function changeFolderTitleNow() {
        if (!changeFolderTitle) {
            setChangeFolderTitle(true);
        } else {
            updateFolderTitleServer();
            updateTimestamp();

            setChangeFolderTitle(false);
        }
    }
    async function updateSingularDocument(id, value) {
        const otherDoc = doc(mainDocRef, "files", id);
        await setDoc(otherDoc, {
            name: value.name,
            data: value.data,
        });
    }
    async function updateFolderTitleServer() {
        await updateDoc(mainDocRef, {
            name: folderTitle,
        });
    }
    function updateFolderTitle(event) {
        setFolderTitle(event.target.value);
    }
    return (
        <>
            <div className='complete-editor-container'>
                <div className='sidebar-container'>
                    <br />
                    <br />

                    <div className='large-tab-container'>
                        <div className='folder-title-container'>
                            <FaFolder style={{ marginLeft: "1rem" }}></FaFolder>
                            {!changeFolderTitle ? <p className='folder-title-actual'>{folderTitle}</p> : <input className='folder-title-actual' onChange={updateFolderTitle} value={folderTitle}></input>}
                            <button onClick={changeFolderTitleNow}>{!changeFolderTitle ? <MdEdit style={{ marginLeft: "1rem" }}></MdEdit> : <FaSave style={{ marginLeft: "1rem" }}></FaSave>}</button>
                        </div>
                        {Object.keys(totalData).map((item) => (
                            <button onClick={() => switchSelectedFile(item)} className='tab-button'>
                                <span style={{ color: item == visibleFile[0] ? "grey" : "black" }}>{totalData[item].name}</span>
                            </button>
                        ))}
                    </div>
                    <button onClick={addNewFile} className='tab-button save-button' style={{ marginBottom: ".5rem" }}>
                        Add File
                    </button>
                    <button onClick={uploadToFirebase} className='tab-button save-button'>
                        {changesPrompt}
                    </button>
                </div>
                <div className='non-tab-container'>
                    <DisplayFile name={visibleFile[1].name} data={visibleFile[1].data} onTitleChange={changeTitleForSelected} onDataChange={changeDataForSelected}></DisplayFile>
                </div>
            </div>
            <div className='downloading-options'>
                <Link to={"/download/" + mainDocRef.id + "/" + user.uid}>
                    <button className='download-button'>Download All Files</button>
                </Link>
                {/* <button className='download-button'> */}
                <DownloadLink label='Download Current File' filename={visibleFile[1].name} exportFile={() => visibleFile[1].data} style={{ color: "white", textDecoration: "none" }} className='download-button' />
                {/* </button> */}
            </div>
        </>
    );
};
export default Edit;
