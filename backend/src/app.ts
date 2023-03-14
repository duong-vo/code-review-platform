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

    constructor(controllers: Controller[], port:number) {
        this.app = express();
        // use json for requests
        this.app.use(express.json());
        this.port = port;

        // initialize the socket and http server
        this.server = new Server(this.app);
        // this.initializeWebSocket();
        // initalize the the entire application
        // this.connectToDatabase().then(() => {
        //   this.initializeControllers(controllers);
        // }).catch((err) => console.log("Error", err));
    }

    public listen(): void {
        this.app.listen(this.port, () => console.log("application running on", this.port));
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
          });
    }

    private async connectToDatabase(): Promise<void> {
        console.log("got here inside connect to database");
        const { MONGODB_USER, MONGODB_PWD, MONGODB_PATH } = process.env;
        const URI: string = `mongodb://${MONGODB_USER}:${MONGODB_PWD}${MONGODB_PATH}`;
        mongoose.connect(URI);
    }
        
}

export default App;