import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AnySchema } from 'yup';

function validateMiddleware(schema: AnySchema): RequestHandler  {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        console.log("got here inside function of validate middleware schema", schema);
        try {
            const value = await schema.validate({
                body: req.body,
            });
            req.body = value;
            next();
        } catch (error: any) {
            res.status(400).send();
        }
    };
}

export default validateMiddleware;