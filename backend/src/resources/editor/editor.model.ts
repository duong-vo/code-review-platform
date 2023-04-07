import { Schema, model } from 'mongoose';

const EditorSchema = new Schema( 
    {
        _id: {
            type: Number,
            require: true,
        },
        data: {
            type: Object
        }
    }
)

export default EditorSchema;