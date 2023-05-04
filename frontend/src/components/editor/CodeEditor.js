import './index.css';
import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import UserList from './UserList';
import io from "socket.io-client";
import Editor from "@monaco-editor/react";
import { Range } from 'monaco-editor';

const SAVE_INTERVAL_MS = 2000; // 2 seconds for each auto save
const languageKeyMap = {
    "python": "Python",
    "javascript": "JavaScript",
    "java": "Java",
    "cpp": "C++",
    "ruby": "Ruby"
}

const fileExtensionMap = {
    "py": "python",
    "h": "cpp",
    "js": "javascript",
    "cpp": "cpp",
    "java": "java",
    "rb": "ruby"
}

function CodeEditor() {
    const [socket, setSocket] = useState(null);
    const { roomId: editorId } = useParams();
    const [language, setLanguage] = useState("javascript");
    const [userList, setUserList] = useState([]);
    const [decorations, setDecorations] = useState([]);
    const [file, setFile] = useState(null);
    const editorRef = useRef(null);

    // use effect is similar to componentDidMount(), meaning 
    // this will trigger when the componenet is rendered

    useEffect(() => {
        const newSocket = io("http://localhost:9999");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, []);

    // handle user joining
    useEffect(() => {
        if (!socket)
            return
        // test connection
        const name = prompt("Insert name");
        // set timeout to ensure connection
        setTimeout(() => {
            socket.emit("newUser", { editorId, name });
        }, 1000);

        // const name = "hard coded";
        socket.once("receiveEditor", (data) => {
            console.log("received room editor", data);
            //socket.emit("newUser", name);
            setUserList(data.userList);
            editorRef.current.setValue(data.editorData);
        })

        socket.on('updateUserList', (updatedUserList) => {
            console.log("receive new userList", updatedUserList);
            console.log("current userList", userList);
            // setName(user);
            setUserList(updatedUserList);
        });

        return () => {
            socket.emit('disconnect');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    // handle save editor instance
    useEffect(() => {
        if (socket == null)
            return;

        const interval = setInterval(() => {
            socket.emit("saveEditor", editorRef.current.getValue());
        }, SAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval);
        }
    }, [socket, editorRef])

    // handle editor events
    useEffect(() => {
        if (!socket)
            return;
        if (!editorRef)
            return;

        socket.on("receiveEditorChange", (value) => {
            console.log("received change", value);
            editorRef.current.getModel().setValue(value);
        });

        socket.on("receiveLanguageSelect", (language) => {
            console.log("received new language selected", language);
            // editorRef.current.getModel().setLanguage(language);
            setLanguage(language);
        })
    }, [socket]);

    const handleChange = (value, event) => {
        console.log("received event", event);
        // if both are false, this means that the editor is changed
        // by typing

        // is flush means that the current model has been set to a new value
        // this is true only when we call setValue, meaning that the edtior
        // changes by user typing, then it will be false 
        if (!event.isFlush) {
            socket.emit("sendEditorChange", value);
        }
    }

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
        editorRef.current.addAction({
            id: "myPaste",
            label: "Add comment",
            contextMenuGroupId: "9_cutcopypaste",
            run: addCommentContext
        });
    }

    const addCommentContext = (editor, monaco) => {
        console.log("add comment context clicked");
        const selectedObject = editor.getSelection();
        console.log("code editor text selected", selectedObject);

        const startLineNumber = selectedObject.startLineNumber;
        const endLineNumber = selectedObject.endLineNumber;
        const startColumn = selectedObject.startColumn;
        const endColumn = selectedObject.endColumn;
        console.log(startLineNumber, endLineNumber, startColumn, endColumn);
        try {
            const newRange = new Range(
                startLineNumber,
                startColumn,
                endLineNumber,
                endColumn
            )
            console.log("selected range index", newRange);
            const newDecoration = {
                range: newRange,
                options: {
                    className: 'textDecoration',
                }
            };
            console.log("new decoration", newDecoration);
            editor.deltaDecorations([], [newDecoration]);

            const newDecorations = [...decorations, newDecoration];
            setDecorations(newDecorations);
            editor.deltaDecorations([], newDecorations);
        } catch (e) {
            console.log("Error:", e);
        }
        // const flattenedStartIdx = startRow + startCol;
        // const flattenedEndIdx = endRow + endCol;
        // const editorValue = editor.getValue();
        // console.log("editor value", editorValue);
    }

    const handleSelect = (value, event) => {
        console.log("receive select", event);
        socket.emit("sendLanguageSelect", value);
        setLanguage(value);
    }

    const handleContextMenu = (event) => {
        console.log("on context menu event", event);
        event.preventDefault();
        const selection = window.getSelection;
        console.log("Code editor selection:", selection);
    }
    
    const getFileExtension = (fileName) => {
        const dotIndex = fileName.lastIndexOf(".");
        const fileExtension = fileName.substr(dotIndex + 1);
        return fileExtension;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handle file submission raw data", e);
        
        const reader = new FileReader();
        
        // get file extension
        console.log("the file object", file);
        const fileName = file.name;
        const fileExtension = getFileExtension(fileName);
        console.log("file extension", fileExtension);

        // modify the editor
        reader.onload = (event) => {
            const contents = event.target.result;
            
            if (fileExtension in fileExtensionMap) {
                setLanguage(fileExtensionMap[fileExtension]);
                editorRef.current.setValue(contents);
            } else {
                alert("Warning: file not supported");
            }
            
            console.log("file contents", contents);
        }

        reader.readAsText(file);
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    return (
        <div class="container">
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange}></input>
                <button>Submit</button>
            </form>
            <UserList userList={userList} />
            <div class="language">
                {languageKeyMap[language]}
            </div>
            <DropdownButton
                alignRight
                title={languageKeyMap[language]}
                id="dropdown-menu-align-right"
                onSelect={handleSelect}
            >
                <Dropdown.Item eventKey="python">Python</Dropdown.Item>
                <Dropdown.Item eventKey="javascript">Javascript</Dropdown.Item>
                <Dropdown.Item eventKey="java">Java</Dropdown.Item>
                <Dropdown.Item eventKey="cpp">C++</Dropdown.Item>
                <Dropdown.Item eventKey="ruby">Ruby</Dropdown.Item>
            </DropdownButton>
            <Editor
                height="75vh"
                width="80vh"
                language={language}
                defaultValue=""
                onChange={handleChange}
                onMount={handleEditorDidMount}
                onContextMenu={handleContextMenu}
                theme="vs-dark"
            />
        </div>
    )
}

export default CodeEditor;