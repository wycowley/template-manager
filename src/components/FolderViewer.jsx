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
                <button className='action-button'>Download all files</button>
                <button className='action-button'>Copy download link</button>
            </div>
        </div>
    );
};
export default FolderViewer;
