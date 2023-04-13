import EditorModel from "./editor.model";

export async function findOrCreateEditor(editorId: Number) {
    console.log("received id in database handler", editorId);
    
    try {
        const testObject = {
            _id:editorId,
            data: {}
        }
        const result = await EditorModel.create(testObject);
        console.log("success", result);

    } catch (e) {
        console.log("Error in database handler: ", e);
    }
}
