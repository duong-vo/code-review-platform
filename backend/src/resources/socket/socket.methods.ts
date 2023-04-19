import { Socket } from 'socket.io';

// TODO: the type are not ensured, please check again

export function handleConnection(socket: Socket) {

}

export async function handleJoinEditor(socket: Socket, editorId: string) {
    console.log('received edtior id, new user joining', editorId);
    socket.join(editorId);
}

export function handleNewUser(socket: Socket, userName: string) {

}

export async function handleSaveEditor(socket: Socket, editorContent: Object) {

}

export async function handleEditorChange(socket: Socket, value: string) {

}

export async function handleSelectLanguage(socket:Socket, language: string) {

}