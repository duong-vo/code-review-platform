import { Request, Response, Router } from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import { NextFunction } from 'express-serve-static-core';
import authMiddleware from '../../utils/middleware/auth.middleware';
import validateMiddleware from '../../utils/middleware/validate.middleware';
import joischema from '../../resources/user/user.joischema';


class UserController implements Controller {
    public path = '/user';
    public router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.post(
            `${this.path}/register`,
            validateMiddleware(joischema.register),
            this.register
        )
    }

    private register = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response  | void> => {
        try {
            // console.log("xxx1.req", req);
            // console.log("xxx2.req.body", req.body);
            const { name, email, password } = req.body;
            console.log(name, email, password);
        } catch (error) {
            console.log("ERROR: ", error);
        } 
    }
}

export default UserController;