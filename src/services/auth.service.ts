import { randomBytes, createHmac } from 'crypto';
import jwt from 'jsonwebtoken';
import config from '@/config';
import UserInterface from '@/interfaces/user.interface';
import userModel from '@/models/user.model';
import logger from '@/libs/logger';
import { ObjectId } from 'mongodb';

class AuthService {
    private _errors = {
        password: "User or password incorrect"
    };
    /**
     * signIn
     * @param username 
     * @param password 
     * @returns token
     */
    public async signIn(email: string, password: string): Promise<{ token: string; refresh_token: string; user: { _id: ObjectId, username: string } }> {
        const user_db: UserInterface = await userModel.findOne({ email })
        if (!user_db) {
            throw new Error(this._errors.password);
        }
        const user: UserInterface = {
            _id: user_db._id,
            username: user_db.username,
            email: user_db.email,
            password: user_db.password,
            salt: user_db.salt
        };
        const salted_password = this.sha512(password, user.salt);
        if (salted_password.hash_password === user.password) {
            const token = this.generateToken(user);
            logger.info('New session:', email, token);
            return {
                token: token,
                refresh_token: this.generateToken(user, true),
                user: {
                    _id: user._id,
                    username: user.username
                }
            };
        }
        throw new Error(this._errors.password);
    }

    /**
     * refresh token
     * @param token 
     * @returns 
     */
    public async refreshToken(token: string): Promise<{ token: string; refresh_token: string; user: { _id: ObjectId, username: string } }> {
        const token_verified: { user: ObjectId, type: string, iat: number, exp: number } = this.verifyToken(token, true);
        if (token_verified.type !== 'refresh') {
            throw new Error('Invalid token');
        }
        const user: UserInterface = await this.getUserById(token_verified.user);
        if (!user) {
            throw new Error('Invalid token');
        }
        return {
            token: this.generateToken(user),
            refresh_token: this.generateToken(user, true),
            user: {
                _id: user._id,
                username: user.username
            }
        };
    }

    /**
     * signUp
     * @returns token
     */
    public async signUp(username: string, email: string, password: string): Promise<{ token: string; refresh_token: string; user: { _id: ObjectId, username: string } }> {
        const user_db: UserInterface = await userModel.findOne({ username })
        if (user_db) {
            throw new Error("User already exists");
        }
        const email_db: UserInterface = await userModel.findOne({ email })
        if (email_db) {
            throw new Error("Email already exists");
        }
        const salted_password = this.sha512(password);
        const user: UserInterface = {
            username: username,
            email: email,
            password: salted_password.hash_password,
            salt: salted_password.salt
        };
        const new_user: UserInterface = await userModel.create(user);
        const token = this.generateToken(new_user);
        logger.info('New session:', username, token);
        return {
            token: token,
            refresh_token: this.generateToken(user, true),
            user: {
                _id: new_user._id,
                username: new_user.username
            }
        };
    }

    /**
     * gets user by username
     * @param username 
     * @returns 
     */
    public async getUserByUsername(username: string): Promise<UserInterface> {
        return userModel.findOne({ username });
    }

    /**
     * gets user by ObjectId
     * @param _id ObjectId for mongo
     * @returns 
     */
    public async getUserById(_id: ObjectId): Promise<UserInterface> {
        return userModel.findOne({ _id });
    }

    // #region password controller
    /********************************************/
    /************ PASSWORD CONTROLLER ***********/
    /********************************************/
    /**
     * generate salt
     * @param length 
     * @returns 
     */
    private generateSalt(length: number = 32): string {
        return randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);   /** return required number of characters */
    }
    /**
     * create encrypted password
     * @param password 
     * @param salt 
     * @returns 
     */
    private sha512(password: string, salt: string = this.generateSalt()) {
        const hash = createHmac('sha512', salt); /** Hashing algorithm sha512 */
        hash.update(password);
        const value = hash.digest('hex');
        return {
            salt: salt,
            hash_password: value
        };
    }
    // #endregion password

    //#region token
    /*******************************************/
    /****************** TOKEN ******************/
    /*******************************************/
    /**
     * 
     * @param user 
     * @param refresh refresh token or normal token
     * @returns 
     */
    private generateToken(user: UserInterface, refresh: boolean = false): string {
        return jwt.sign(
            {
                user: user._id,
                type: refresh ? 'refresh' : 'access'
            },
            config.jwt.secret,
            { expiresIn: (refresh) ? config.jwt.refresh_expiresIn : config.jwt.expiresIn }
        );
    }

    /**
     * verify token 
     * @param token
     * @param refresh refresh token or normal token (default: false)
     * @returns 
     */
    public verifyToken(token: string, refresh: boolean = false): { user: ObjectId, type: string, iat: number, exp: number } {
        try {
            const token_verified: any = jwt.verify(token, config.jwt.secret);
            return token_verified;
        } catch (err) {
            if (err.message === 'jwt expired') {
                if (refresh) {
                    throw new Error('Session expired');
                } else {
                    throw new Error('Token expired');
                }
            }
            throw new Error("Invalid token");
        }
    }
    //#endregion token
}
export default new AuthService();