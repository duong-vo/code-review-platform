import express, { Application } from 'express';
import Controller from './utils/interfaces/controller.interface';
import mongoose from 'mongoose';
import { Server, ServerOptions } from 'http';
import 'dotenv/config';
import { WebSocketServer, WebSocket } from 'ws';
// const app: Application = express();

// app.get('/', (req, res) => {
//     res.send('Hello');
// });

// app.listen(8000, () => console.log("server running"))
class App {
    public app: Application;
    public port: number;
    public server: Server;
    public webSocketServer: WebSocketServer;

    constructor(controllers: Controller[], port:number) {
        this.app = express();
        // use json for requests
        this.app.use(express.json());
        this.port = 8000;

        // initialize the socket and http server
        this.server = new Server(this.app);
        this.webSocketServer = new WebSocketServer({ server: this.server })
        this.initializeWebSocket();
        // initalize the the entire application
        this.connectToDatabase();
        this.initializeControllers(controllers);
    }

    public listen(): void {
        this.app.listen(this.port, () => console.log("server running on", this.port));
    }

    private initializeWebSocket() {
        this.webSocketServer.on('connection', (socket: WebSocket) => {
          console.log('WebSocket client connected');
    
          socket.on('message', (message: string) => {
            console.log('Received WebSocket message:', message);
    
            // Broadcast message to all connected WebSocket clients
            this.webSocketServer.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(message);
              }
            });
          });
    
          socket.on('close', () => {
            console.log('WebSocket client disconnected');
          });
        });
      }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
          });
    }

    private connectToDatabase(): void {
        const { MONGODB_USER, MONGODB_PWD, MONGODB_PATH } = process.env;
        const URI: string = `mongodb://${MONGODB_USER}:${MONGODB_PWD}${MONGODB_PATH}`;
        mongoose.connect(URI);
    }
        
}

export default App;