import { NextFunction, Request, Response } from "express";
import authService from "@/services/auth.service";
import { ObjectId } from "mongodb";
/**
 * This middleware is used to check if the user is authenticated
 * Requires to have "Bearer" or "Token" before the token
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header_token = req.headers['authorization'];
    if (!header_token) {
      throw new Error("No token")
    }
    const authorization: string[] = header_token.split(" ");
    if (authorization[0] !== "Bearer") {
      throw new Error("Invalid token");
    }
    const token_verified: { user: ObjectId, type: string, iat: number, exp: number } = authService.verifyToken(authorization[1]);
    if(token_verified.type !== 'access') {
      throw new Error("Invalid token");
    }
    // logger.info('token_verified', token_verified)
    // logger.info('token_verified.user', token_verified.user)
    req.user = await authService.getUserById(new ObjectId(token_verified.user));
    // logger.info('req.user', req.user)
    return next();
  } catch (err) {
    return next(err);
  }
}