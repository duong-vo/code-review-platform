import { NumberExpression } from "mongoose";
import EditorModel from "./editor.model";

export async function findOrCreateEditor(editorId: Number) {
    console.log("received id in database handler", editorId);
    
    try {

        const result = await EditorModel.findById(editorId);
        if (result)
            return result;
        else
        return await EditorModel.create({ _id: editorId, data: {} })

    } catch (e) {
        console.log("Error in database handler: ", e);
    }
}

export async function findByIdAndUpdate(editorId: Number, data: Object) {
    await EditorModel.findByIdAndUpdate(editorId, { data });
}