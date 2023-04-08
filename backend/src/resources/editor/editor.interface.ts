import { Document } from 'mongoose';

export default interface Edtitor extends Document {
    _id: number;
    data: object;
}