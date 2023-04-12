import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import io from "socket.io-client";
import Editor from "@monaco-editor/react";


const SAVE_INTERVAL_MS = 2000; // 2 seconds for each auto save

function CodeEditor() {
    const [socket, setSocket] = useState(null);
    const {roomId: editorId} = useParams();
    const [name, setName] = useState(null);
    const [language, setLanguage] = useState("javascript");
    const [userList, setUserList] = useState([]);
    // this is used to make sure that we send changes only when
    // the user is typing in
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

    useEffect(() => {
        if (!socket)
            return
        // test connection
        const name = prompt("Insert name");
        console.log("receive the name, emitted to the backend:", name);
        console.log("editor id: ", editorId);

        setTimeout(() => {
            socket.emit("newUser", name);
            socket.emit("joinEditor", editorId);
            //TODO: this does not look correct
            setUserList((userList) => [name]); 
            // manually add the first user to userList because broadcasting
            // requires multiple users
        }, 1000);
    }, [socket]);

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

    useEffect(() => {
        if (!socket)
            return;
        if (!editorRef)
            return;
        socket.on('userConnected', (user) => {
            console.log("user connected", user);
            console.log("current userList", userList);
            setName(user);
            setUserList((userList) => [...userList, user]);
        });
        
        socket.on("editorChanged", (value) => { 
            console.log("received change", value);
            editorRef.current.getModel().setValue(value);
        });

        socket.on("languageSelect", (language) => {
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

    // const handleDidChangeModelContent = (event) => {
    //     console.log("received model change",);
    //     console.log(event);
    // }


    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    }

    const handleSelect = (value, event) => {
        console.log("receive select", event);
        socket.emit("sendLanguageSelect", value);
        setLanguage(value);  
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
                title={language}
                id="dropdown-menu-align-right"
                onSelect={handleSelect}
            >
                <Dropdown.Item eventKey="python">python</Dropdown.Item>
                <Dropdown.Item eventKey="javascript">javascript</Dropdown.Item>
                <Dropdown.Item eventKey="java">java</Dropdown.Item>
                <Dropdown.Item eventKey="cpp">cpp</Dropdown.Item>
                <Dropdown.Item eventKey="ruby">ruby</Dropdown.Item>
            </DropdownButton>
        </div>
    )
}

export default CodeEditor;