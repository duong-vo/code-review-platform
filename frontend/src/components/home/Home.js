import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function Home() {
    const [room, setRoom] = useState("");
    
    const createRoom = () => {
        const roomId = Math.floor(Math.random() * 1000000).toString();
        // Redirect the user to the new room URL
        window.location.href = `/room/${roomId}`;
    }

    const joinRoom = () => {
        if (room !== "") {
            console.log(room);
            socket.emit("join_room", room);
          }
    }
    return (
        <div style={{
            display: 'block',
            width: 700,
            padding: 30
        }}>
        <button type="submit" class="btn btn-dark" onClick={createRoom}>New Room</button>
        <Form.Control type="text" 
                        placeholder="Enter room Id"
                        onChange={(event) => {
                            setRoom(event.target.value);
                          }} />
        <button class="btn btn-dark" onClick={joinRoom}>Join Room</button>

        </div>
    );
}

export default Home;