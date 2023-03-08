import { WebSocketServer, WebSocket } from 'ws';

class SocketServer {
    public server: WebSocketServer;
    public port = 9999;
    
    constructor() {
        this.port = 9999;
        this.server = new WebSocketServer({port: this.port});
        this.server.on('connection', (ws: WebSocket) => {
            ws.on('message', (data) => {
                console.log(data)
            })
        })
    }
    private onConnection(ws: WebSocket) {
        console.log(ws);
    }
}

export default SocketServer;
