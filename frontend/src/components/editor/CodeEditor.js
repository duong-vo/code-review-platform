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
            //TODO: this does not look correct
            setUserList((userList) => [name]); 
            // manually add the first user to userList because broadcasting
            // requires multiple users
        }, 1000);
    }, [socket]);

    useEffect(() => {
        if (!socket)
            return
        socket.on('userConnected', (received) => {
            console.log("user connected", received)
            console.log("current userList", userList)
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
                language={language}
                defaultValue=""
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