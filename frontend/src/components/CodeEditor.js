import React from "react";
import ReactDOM from "react-dom";

import Editor from "@monaco-editor/react";

function CodeEditor() {
  return (
   <Editor
     height="90vh"
     defaultLanguage="javascript"
     defaultValue="// some comment"
   />
  )
}

export default CodeEditor;