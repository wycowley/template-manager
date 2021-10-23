import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";

const FolderViewer = (props) => {
    const [date, changeDate] = useState("Loading...");
    useEffect(() => {
        console.log(props.timestamp.toDate());
        let date = props.timestamp.toDate() + "";
        date = date.split(" ");
        console.log(date);
        date = date[4] + " " + date[1] + " " + date[2];
        changeDate(date);
    }, []);
    function copyUrl() {
        let url = "https://www.wyattcowley.com/template-manager/#/download/";
        url = url + props.id + "/" + props.userId;
        navigator.clipboard.writeText(url);
    }
    return (
        <div className='folder-viewer-container'>
            <div className='first-row'>
                <p className='folder-title'>{props.name}</p>
                <Link to={"/edit/" + props.id} className='edit-link'>
                    <MdEdit style={{ width: 100 + "%", height: 100 + "%", fill: "rgb(44, 44, 83)" }}></MdEdit>
                </Link>
            </div>
            <p>{"Last Edited " + date}</p>
            <div className='last-row'>
                <Link to={"/download/" + props.id + "/" + props.userId}>
                    <button className='action-button'>Download all files</button>
                </Link>
                <button className='action-button' onClick={copyUrl}>
                    Copy download link
                </button>
            </div>
        </div>
    );
};
export default FolderViewer;
