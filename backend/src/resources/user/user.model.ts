import { Schema, model } from 'mongoose';
import User from '../../resources/user/user.interface';

const UserSchema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String
        }
    }
)
