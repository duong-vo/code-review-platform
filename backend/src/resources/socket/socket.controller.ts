import { Request, Response, Router } from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import { Socket } from 'socket.io';

class SocketController implements Controller {
    public path = '/';
    public router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(
            `${this.path}/`,
            (req,res) => {
                console.log("application running!");
                res.send('<h1>Hello world</h1>');
            }
        )
    }
}

export default SocketController;