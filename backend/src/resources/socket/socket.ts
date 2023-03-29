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
            console.log('user connected', socket.id);
            // test socket io emit
            //socket.emit('messageResponse', "hi mom")
            socket.on('message', (data) => {
                console.log(data);
                socket.send('received, thank you!');
                this.io.emit('message', data);
            });
            socket.on('new-user', (name) => {
                console.log('received new user name', name);
            })
        });

        this.io.on('error', (err: any) => {
            console.log('Socket server error:', err);
        })
    }

    public listen() {
        this.server.listen(this.port, () => {
            console.log('socket server running on', this.port);
        });
    }
}

export default SocketServer;
