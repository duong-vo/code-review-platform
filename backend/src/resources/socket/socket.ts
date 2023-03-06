import { WebSocketServer } from 'ws';

class ServerSocket {
    public server: WebSocketServer;
    public port = 9999;
    
    constructor() {
        this.port = 9999;
        this.server = new WebSocketServer({port: this.port});
        this.server.on('connection', (ws) => {
            ws.on('message', (data) => {
                console.log(data)
            })
        })
    }
    private onConnection(ws: WebSocket) {
        console.log(ws);
    }


}
