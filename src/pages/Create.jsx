import { useEffect } from "react";
import app from "../firebase.js";
import { doc, setDoc, addDoc, collection, getFirestore } from "firebase/firestore";
import { useHistory } from "react-router";
const db = getFirestore();

const Create = (props) => {
    let history = useHistory();
    useEffect(() => {
        console.log(props.user.uid);
        const userDocument = doc(db, "users", props.user.uid);
        setDocument(userDocument);
    }, []);
    async function setDocument(userDocument) {
        await setDoc(userDocument, {
            uid: props.user.uid,
            displayName: props.user.displayName,
        });

        const documentReference = await addDoc(collection(userDocument, "folders"), {
            name: "Untitled",
            owner: props.user.uid,
        });
        const subDocumentReference = await setDoc(doc(documentReference, "files", "Untitled.FileExtension"), {
            name: "Untitled.FileExtension",
            data: "Start typing here",
        });
        console.log(documentReference.id);
        history.push("/edit/" + documentReference.id);
    }
    return <></>;
};
export default Create;
