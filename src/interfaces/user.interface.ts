import { ObjectId } from "mongodb";

export default interface UserInterface {
    _id?: ObjectId;
    username?: string;
    email?: string;
    password?: string;
    salt?: string;
    createdAt?: Date;
    updatedAt?: Date;
    likes_artists?: ObjectId[];
    // likes_albums?: ObjectId[];
    // likes_tracks?: ObjectId[];
}