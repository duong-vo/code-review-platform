import './App.css';
import CodeEditor from './components/editor/CodeEditor';
import Home from './components/home/Home';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/:roomId" element={<CodeEditor/>}/>
      </Routes>
    </Router>
  );
}

export default App;
