import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import middleware from '@/api/middleware';
import apiService from '@/services/api.service';

const route: Router = Router();

export default (app: Router): void => {
    app.use('/test', route);

    route.get(
        '/teapot',
        middleware,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                return apiService.iAmATeapot(req, res, { message: "I'm a Teapot" });
            } catch (err) {
                next(err);
            }
        }
    )

    route.get('/helloworld',
        middleware,
        celebrate({
            query: Joi.object()
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                return apiService.success(req, res, { message: "Hello World" });
            } catch (err) {
                next(err);
            }
        }
        
    )
}