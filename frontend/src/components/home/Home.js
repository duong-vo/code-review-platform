import './index.css';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';


function Home() {
    const [room, setRoom] = useState("");
    const navigate = useNavigate();

    const createRoom = () => {
        const roomId = Math.floor(Math.random() * 1000000).toString();
        // Redirect the user to the new room URL
        navigate(`/${roomId}`);
    }

    const joinRoom = () => {
        if (room !== "") {
            console.log(room);
            navigate(`/${room}`);
        }
    }

    return (
        <div class="buttons-container">
                <button type="submit" class="btn btn-dark" onClick={createRoom}>New Room</button>
                <Form.Control
                    type="text"
                    placeholder="Enter room Id"
                    onChange={(event) => { setRoom(event.target.value); }} />
                <button class="btn btn-dark" onClick={joinRoom}>Join Room</button>
        </div>
    );
}

export default Home;