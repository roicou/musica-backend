import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';

// internal imports
import config from '@/config'
import routes from '@/api';
import apiService from '@/services/api.service';
import logger from '@/libs/logger';


export default async (app: Application) => {
    /**
     * endpoints
     */
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(config.api.prefix, routes());

    /// catch 404 and forward to error handler
    app.use((req: Request, res: Response, next: NextFunction) => {
        const err = new Error('Not Found');
        // err['status'] = 404;
        next(err);
    });
    app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
        let error: Error;
        // logger.info('err', err)
        /**
         * Handle errors
         */
        switch (err.message) {
            /**
             * 404 - Not Found
             */
            case 'Not Found':
                return apiService.notFound(req, res, err.message);

            /**
             * 400 - Bad Request
             */
            case 'Validation failed': // this is a joi error
                error = err.details.get("body") || err.details.get("params") || err.details.get("query") || err.details.get("headers");
                logger.info("Celebrate's Error:", error.details[0]);
                err.message = 'Missing required parameters';
                return apiService.badRequest(req, res, err.message);
            // rest of the cases for 400 bad request
            case 'User already exists':
                return apiService.badRequest(req, res, err.message);

            /**
             * 401 - Unauthorized
             */
            case 'User or password incorrect':
            case 'Token expired':
            case 'Session expired':
            case 'Invalid token':
            case 'No token':
                return apiService.unauthorized(req, res, err.message);

            /**
             * 403 - Forbidden
             */
            case 'Permission denied':
                return apiService.forbidden(req, res, err.message);

            /**
             * No handled error
             * Something was wrong
             * 500 - Internal Server Error
             */
            default:
                logger.info("-------------------------------------------")
                logger.info('No error handler for:', err.message);
                logger.info('Error:', err)
                logger.info("-------------------------------------------")
                return apiService.error(req, res, "Something was wrong");
        }
    });
}