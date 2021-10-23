import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { MdEdit } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import "../styles/Edit.css";
import "ace-builds/src-noconflict/theme-github";

const DisplayFile = (props) => {
    const [updateTitle, setUpdateTitle] = useState(false);
    const [localTitle, setLocalTitle] = useState(props.name);
    const [enteredValue, setValue] = useState(props.data);
    useEffect(() => {
        setLocalTitle(props.name);
        setValue(props.data);
    }, [props]);

    function onChange(newValue) {
        setValue(newValue);
        props.onDataChange(newValue);
    }
    function pressedEditButton() {
        if (updateTitle == true) {
            props.onTitleChange(localTitle);
        }
        setUpdateTitle(!updateTitle);
    }
    function updateTitleLocally(event) {
        setLocalTitle(event.target.value);
    }
    return (
        <div className='file-specific-section'>
            {!updateTitle ? <h2 className='file-title'>{props.name}</h2> : <input value={localTitle} onChange={updateTitleLocally} className='title-entry'></input>}
            <button onClick={pressedEditButton} className='edit-title-button'>
                {!updateTitle ? <MdEdit className='edit-title-icon'></MdEdit> : <FaSave className='edit-title-icon'></FaSave>}
            </button>
            <AceEditor onChange={onChange} height='80%' width='95%' className='code-editor' theme='xcode' name='main-code-editor' value={enteredValue} editorProps={{ $blockScrolling: true }} />
        </div>
    );
};
export default DisplayFile;
