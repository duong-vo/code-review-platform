import express, { Application } from 'express';
import Controller from './interfaces/controller.interface';
import mongoose from 'mongoose';
import 'dotenv/config';
// const app: Application = express();

// app.get('/', (req, res) => {
//     res.send('Hello');
// });

// app.listen(8000, () => console.log("server running"))
class App {
    public app: Application;
    public port: number;

    constructor(controllers: Controller[], port:number) {
        this.app = express();
        this.port = 8000;
        this.connectToDatabase();
        this.initializeControllers(controllers);
    }

    public listen(): void {
        this.app.listen(this.port, () => console.log("server running on", this.port));
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