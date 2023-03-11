import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Dropdown from 'react-bootstrap/Dropdown';


import Editor from "@monaco-editor/react";

function CodeEditor() {
  return (
    <div>
   <Editor
     height="90vh"
     width = "80vh"
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