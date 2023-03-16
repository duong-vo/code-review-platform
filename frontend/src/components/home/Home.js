import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import socketIOclient from 'socket.io-client';

WS = "http://localhost:9999"

function Home() {
    useEffect(() => {
        socketIOclient(WS);
    }, []);
    return (
        <div style={{ display: 'block', 
        width: 700, 
        padding: 30 }}>
            <Form>
                <Form.Group>
                    <Form.Control type="text"
                        placeholder="new room" />
                </Form.Group>
                <button type="submit" class="btn btn-dark">New Room</button>
            </Form>

        </div>
    );
}

export default Home;