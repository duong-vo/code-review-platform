import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import io from "socket.io-client";
import Editor from "@monaco-editor/react";


function CodeEditor() {
    const [socket, setSocket] = useState(null);
    const [name, setName] = useState(null);
    const [language, setLanguage] = useState("javascript");
    const [userList, setUserList] = useState([]);

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
        }, 1000);
    }, [socket]);

    useEffect(() => {
        if (!socket)
            return
        socket.on('userConnected', (received) => {
            console.log("user connected", received)
            setName(received);
            setUserList((userList) => [...userList, received]);
        });
    }, [socket]);

    return (
        <div>
            <div>
                {
                    userList.map((name) => <div> {name} </div>)
                }
            </div>
            <div>
                {language}
            </div>
            <Editor
                height="90vh"
                width="80vh"
                defaultLanguage={"javascript"}
                defaultValue="// some comment"
            />
            <DropdownButton
                alignRight
                title="Dropdown right"
                id="dropdown-menu-align-right"
                onSelect={handleSelect}
            >
                <Dropdown.Item eventKey="python">Python</Dropdown.Item>
                <Dropdown.Item eventKey="option-2">option-2</Dropdown.Item>
                <Dropdown.Item eventKey="option-3">option 3</Dropdown.Item>
            </DropdownButton>
        </div>
    )
}

export default CodeEditor;