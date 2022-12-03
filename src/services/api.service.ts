import HTTP_CODES from "@/config/httpcodes.config";
import { Request, Response } from "express";
import logger from '@/libs/logger';

class ApiService {
    /**
     * 200 success
     * @param req 
     * @param res 
     * @param data 
     */
    public success(req: Request, res: Response, data: any) {
        logger.info("Success on", req.method, req.url, " | User:", req.user?.username);
        res.status(HTTP_CODES.ok).json(data);
    }
    /**
     * 400 bad request
     * @param req 
     * @param res 
     * @param err 
     */
    public badRequest(req: Request, res: Response, err: string): void {
        logger.info("Bad Request on", req.method, req.originalUrl, " | User:", req.user?.username, ":", err);
        res.status(HTTP_CODES.bad_request).json(err);
    }
    /**
     * 500 internal server error
     * @param req 
     * @param res 
     * @param err 
     */
    public error(req: Request, res: Response, err: string) {
        logger.info("Error on", req.method, req.url, ":", err);
        res.status(HTTP_CODES.internal_server_error).json(err);
    }
    /**
     * 404 not found
     * @param req 
     * @param res 
     * @param err 
     */
    public notFound(req: Request, res: Response, err: string) {
        logger.info("Error on", req.method, req.url, ":", "404");
        res.status(HTTP_CODES.not_found).json(err);
    }
    /**
     * 403 forbidden
     * @param req 
     * @param res 
     * @param err 
     */
    public forbidden(req: Request, res: Response, err: string) {
        logger.info("Forbidden on", req.method, req.url, ":", err);
        res.status(HTTP_CODES.forbidden).json(err);
    }
    /**
     * 401 unauthorized
     * @param req 
     * @param res 
     * @param err 
     */
    public unauthorized(req: Request, res: Response, err: string) {
        logger.info("Unauthorized on", req.method, req.url, ":", err);
        res.status(HTTP_CODES.unauthorized).json(err);
    }

    /**
     * 418 I'm a teapot
     * @param req 
     * @param res 
     * @param data 
     */
    public iAmATeapot(req: Request, res: Response, data: any) {
        logger.info("I am a teapot on", req.method, req.url, ":", data);
        res.status(HTTP_CODES.im_a_teapot).json(data);
    }

}
export default new ApiService();