import { NumberExpression } from "mongoose";
import EditorModel from "./editor.model";

export async function findOrCreateEditor(editorId: String) {
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

export async function findByIdAndUpdate(editorId: String, data: Object) {
    await EditorModel.findByIdAndUpdate(editorId, { data });
}