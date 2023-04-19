import 'dotenv/config';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import { Server, ServerOptions } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import Controller from './utils/interfaces/controller.interface';

class App {
    public app: Application;
    public port: number;
    public server: Server;

    /**
     * Construct the application with the specified controller and
     * port number
     * @param controllers a list of controller
     * @param port the port number
     */
    constructor(controllers: Controller[], port:number) {
        this.app = express();
        // use json for requests
        this.app.use(express.json());
        this.port = port;
        // initialize the socket and http server
        this.server = new Server(this.app);
        // initalize the the entire application
        this.connectToDatabase().catch((err) => console.log("Error", err));
        this.initializeControllers(controllers);
    }

    /**
     * Integrate the controller into the application
     * 
     * @param controllers a list of controller
     */
    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
          });
    }

    private async connectToDatabase(): Promise<void> {
        console.log("got here inside connect to database");
        const { MONGODB_USER, MONGODB_PWD, MONGODB_PATH } = process.env;
        const URI: string = `mongodb+srv://${MONGODB_USER}:${MONGODB_PWD}${MONGODB_PATH}`;
        mongoose.connect(URI);
        console.log("connected to the database");
    }
}

export default App;
