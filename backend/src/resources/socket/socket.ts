import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

class SocketServer {
    public webSocketServer: WebSocketServer;
    public port = 9999;
    public server: Server;
    
    constructor(server: Server) {
        this.port = 9999;
        this.server = server;
        this.webSocketServer = new WebSocketServer({server});
        this.webSocketServer.on('connection', (ws: WebSocket) => {
            console.log("user connected,");
            ws.on('message', (data) => {
                console.log(data);
                ws.send("received, thank you!");
            })
        })
    }

    public listen() {
        this.server.listen(this.port, () => {
            console.log("socket server running on", this.port);
        })
    }
    private onConnection(ws: WebSocket) {
        console.log(ws);
    }
}

export default SocketServer;
