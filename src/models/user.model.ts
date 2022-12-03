import UserInterface from '@/interfaces/user.interface';
import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';

const UserModel = new Schema<UserInterface>({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    },

    salt: {
        type: String,
        required: true
    },

    likes_artists: {
        type: [ObjectId],
        ref: 'Artist'
    },

    // likes_albums: {
    //     type: [ObjectId],
    //     ref: 'Album'
    // },

    // likes_tracks: {
    //     type: [ObjectId],
    //     ref: 'Track'
    // }
    
}, {
    timestamps: true,
    versionKey: false
});

export default model<UserInterface>('User', UserModel);