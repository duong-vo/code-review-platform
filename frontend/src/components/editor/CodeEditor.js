import React, { useEffect, useState, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import io from "socket.io-client";
import Editor from "@monaco-editor/react";


// TODO: use onDidChangeModelContent to find the source of the change!!!

function CodeEditor() {
    const [socket, setSocket] = useState(null);
    const [name, setName] = useState(null);
    const [language, setLanguage] = useState("javascript");
    const [userList, setUserList] = useState([]);
    // this is used to make sure that we send changes only when
    // the user is typing in
    const editorRef = useRef(null);
    
    const handleSelect = (event) => { 
        setLanguage(event);
    }

    // use effect is similar to componentDidMount(), meaning 
    // this will trigger when the componenet is rendered

    useEffect(() => {
        const newSocket = io("http://localhost:9999");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, []);

    useEffect(() => {
        if (!socket)
            return
        // test connection
        const name = prompt("Insert name");
        console.log("receive the name, emitted to the backend:", name);
        setTimeout(() => {
            socket.emit("newUser", name);
            //TODO: this does not look correct
            setUserList((userList) => [name]); 
            // manually add the first user to userList because broadcasting
            // requires multiple users
        }, 1000);
    }, [socket]);

    useEffect(() => {
        if (!socket)
            return;
        if (!editorRef)
            return;
        socket.on('userConnected', (received) => {
            console.log("user connected", received);
            console.log("current userList", userList);
            setName(received);
            setUserList((userList) => [...userList, received]);
        });
        
        socket.on("editorChanged", (value) => { 
            console.log("received change", value);
            editorRef.current.getModel().setValue(value);
        });

    }, [socket]);

    const handleChange = (value, event) => {
        console.log("received event", event);
        // if both are false, this means that the editor is changed
        // by typing
        if (!event.isRedoing && !event.isUndoing) {
            socket.emit("sendEditorChange", value);
        }

    }

    // const handleDidChangeModelContent = (event) => {
    //     console.log("received model change",);
    //     console.log(event);
    // }


    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    }

    return (
        <div>
            <div>
                {userList.map((name) => <div> {name} </div>)}
            </div>
            <div>
                {language}
            </div>
            <Editor
                height="90vh"
                width="80vh"
                language={language}
                defaultValue=""
                onChange={handleChange}
                // onDidChangeModelContent={handleDidChangeModelContent}
                onMount={handleEditorDidMount}
            />
            <DropdownButton
                alignRight
                title="Dropdown right"
                id="dropdown-menu-align-right"
                onSelect={handleSelect}
            >
                <Dropdown.Item eventKey="python">Python</Dropdown.Item>
                <Dropdown.Item eventKey="javascript">JavaScript</Dropdown.Item>
                <Dropdown.Item eventKey="java">Java</Dropdown.Item>
                <Dropdown.Item eventKey="cpp">C++</Dropdown.Item>
                <Dropdown.Item eventKey="ruby">Ruby</Dropdown.Item>
            </DropdownButton>
        </div>
    )
}

export default CodeEditor;