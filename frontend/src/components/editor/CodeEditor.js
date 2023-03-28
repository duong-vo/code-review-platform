import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Dropdown from 'react-bootstrap/Dropdown';
import io from "socket.io-client";
import Editor from "@monaco-editor/react";


function CodeEditor() {
  const [socket, setSocket] = useState();

  // use effect is similar to componentDidMount(), meaning 
  // this will trigger when the componenet is rendered
  useEffect(() => {
    const newSocket = io("http://localhost:9999")
    console.log("new socket when connected to code editor", newSocket);
    setSocket(newSocket);
  })
  return (
    <div>
      <div> test </div>
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