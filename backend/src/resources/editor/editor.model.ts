import { Schema, model, Document } from 'mongoose';
import Editor from './editor.interface';


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

const EditorModel = model<Editor & Document>('Editor', EditorSchema);
export default EditorModel;