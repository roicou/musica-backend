import UserInterface from '@/interfaces/user.interface';
import { Schema, model } from 'mongoose';


const UserModel = new Schema<UserInterface>({
    username: {
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
    }
    
}, {
    timestamps: true,
    versionKey: false
});

export default model<UserInterface>('User', UserModel);