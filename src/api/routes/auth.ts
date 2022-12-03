import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import authService from '@/services/auth.service';
import apiService from '@/services/api.service';
import { ObjectId } from 'mongodb';

const route: Router = Router();

export default (app: Router): void => {
    app.use('/auth', route);

    route.post('/signin',
        celebrate({
            body: Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { username, password } = req.body;
                const user_token: { token: string; user: { _id: ObjectId; username: string; } } = await authService.signIn(username, password);
                if (user_token) {
                    return apiService.success(req, res, user_token)
                }
            } catch (err) {
                next(err);
            }
        }
    )

    route.post('/signup',
        celebrate({
            body: Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required(),
            }),
        }), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { username, password } = req.body;
                const user_token: { token: string; user: { _id: ObjectId; username: string; } } = await authService.signUp(username, password);
                if (user_token) {
                    return apiService.success(req, res, user_token);
                }
            } catch (err) {
                next(err);
            }
        })

    route.post('/refresh',
        celebrate({
            body: Joi.object({
                refresh_token: Joi.string().required(),
            }),
        }), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { refresh_token } = req.body;
                const user_token: { token: string; refresh_token: string; user: { _id: ObjectId; username: string; } } = await authService.refreshToken(refresh_token);
                if (user_token) {
                    return apiService.success(req, res, user_token);
                }
            } catch (err) {
                next(err);
            }
        }
    )
}