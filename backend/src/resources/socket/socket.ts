// import { WebSocketServer, WebSocket } from 'ws';
// import { Server } from 'http';

// class SocketServer {
//     public webSocketServer: WebSocketServer;
//     public port = 9999;
//     public server: Server;

//     constructor(server: Server) {
//         this.port = 9999;
//         this.server = server;
//         this.webSocketServer = new WebSocketServer({server});
//         this.webSocketServer.on('connection', (ws: WebSocket) => {
//             console.log("user connected,");
//             ws.on('message', (data) => {
//                 console.log(data);
//                 ws.send("received, thank you!");
//             })
//         })
//     }

//     public listen() {
//         this.server.listen(this.port, () => {
//             console.log("socket server running on", this.port);
//         })
//     }
//     private onConnection(ws: WebSocket) {
//         console.log(ws);
//     }
// }

// export default SocketServer;

import { Server } from 'http';
import { Server as WebSocketServer, Socket } from 'socket.io';

class SocketServer {
    public io: WebSocketServer;
    public port = 9999;
    public server: Server;

    constructor(server: Server) {
        this.port = 9999;
        this.server = server;
        this.io = new WebSocketServer(this.server, {
            cors: {
                origin: '*'
            }
        });

        this.io.on('connection', (socket: Socket) => {
            console.log('user connected');

            socket.on('message', (data) => {
                console.log(data);
                socket.send('received, thank you!');
            });
        });

        this.io.on('error', (err: any) => {
            console.log('Socket server error:', err);
        })
    }

    public listen() {
        this.server.listen(this.port, () => {
            console.log('socket server running on TBD');
        });
    }
}

export default SocketServer;
