import { ObjectId } from "mongodb";

export default interface UserInterface {
    _id?: ObjectId;
    username?: string;
    password?: string;
    salt?: string;
    createdAt?: Date;
    updatedAt?: Date;
}