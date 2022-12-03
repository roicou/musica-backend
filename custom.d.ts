import UserInterface from "@/interfaces/user.interface";

declare global {
    namespace Express {
        export interface Request {
            username?: string;
            user?: UserInterface;
        }
    }
    export interface Error {
        data?: any;
        details?: any;
    }
}