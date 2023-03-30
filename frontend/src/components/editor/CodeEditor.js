import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Dropdown from 'react-bootstrap/Dropdown';
import io from "socket.io-client";
import Editor from "@monaco-editor/react";


function CodeEditor() {
    const [socket, setSocket] = useState(null);
    const [name, setName] = useState(null);
    const [userList, setUserList] = useState([]);

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
        setTimeout(() => {
            socket.emit("newUser", name);
          }, 1000); // wait for 1 second before emitting the newUser event
    }, [socket]);

    useEffect(() => {
        if (!socket)
            return
        // test connection
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
            <Editor
                height="90vh"
                width="80vh"
                defaultLanguage="javascript"
                defaultValue="// some comment"
            />
            <Dropdown>
                <Dropdown.Toggle variant="success">
                    Open Menu
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="#">
                        Home Page
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                        Settings
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default CodeEditor;