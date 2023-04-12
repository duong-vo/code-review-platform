import { Document } from 'mongoose';

export default interface Editor extends Document {
    _id: number;
    data: object;
}