import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';

function validateMiddleware(schema: Joi.Schema): RequestHandler  {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        console.log("got here inside function of validate middleware req.body", req.body);
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };
        try {
            const value = await schema.validateAsync(
                req.body,
                validationOptions
            );
            req.body = value;
            next();
        } catch (error: any) {
            res.status(400).send();
        }
    };
}

export default validateMiddleware;