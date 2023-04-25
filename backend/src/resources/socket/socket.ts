import { Server } from 'http';
import { Server as WebSocketServer, Socket } from 'socket.io';
import { findByIdAndUpdate, findOrCreateEditor } from '../editor/editor.methods';
import { emit } from 'process';
import Guest from '../user/guest.interface';
import SocketData from './socket.interface';

class SocketServer {
    public io: WebSocketServer;
    public port = 9999;
    public server: Server;
    public userList: Guest[] = [];
    constructor(server: Server) {
        this.port = 9999;
        this.server = server;
        this.io = new WebSocketServer(this.server, {
            cors: {
                origin: '*'
            }
        });

        this.io.on('connection', (socket: Socket) => {
            console.log('user connected', socket.id);
            console.log('socket.id type', typeof (socket.id));

            socket.on('newUser', async (data: SocketData) => {
                console.log('received edtior id, new user joining', data.editorId);

                socket.join(data.editorId);

                const editor = await findOrCreateEditor(data.editorId);

                if (editor) {
                    console.log("emit the editor onto the frontend", editor);
                    const colorHash:string = Math.floor(Math.random() * 16777215).toString(16);
                    this.userList.push({ name: data.name, socketId: socket.id, colorHash: colorHash });
                    socket.emit("receiveEditor", { editorData: editor.data, userList: this.userList });
                    console.log("updated this.userList", this.userList);
                    socket.broadcast.to(data.editorId).emit("updateUserList", this.userList);
                    console.log("emitted upated list to the front end!");
                }

                // handle user disconnecting
                socket.on('disconnect', this.handledDisconnect(socket,data));

                // handle save editor
                socket.on('saveEditor', async (editorContent) => {
                    // console.log("received save editor", editorContent);
                    await findByIdAndUpdate(data.editorId, editorContent);
                })

                // handle editor change
                socket.on('sendEditorChange', (value) => {
                    console.log("received value on the backend", value);
                    socket.broadcast.to(data.editorId).emit("receiveEditorChange", value);
                    console.log("emitted to the front end", value);
                })

                // handle select language
                socket.on('sendLanguageSelect', (language) => {
                    console.log('received new language', language);
                    socket.broadcast.emit('receiveLanguageSelect', language);
                })
            })

        });

        this.io.on('error', (err: any) => {
            console.log('Socket server error:', err);
        })
    }

    private handledDisconnect(socket: Socket, data: SocketData): (...args: any[]) => void {

        const handler = (data: SocketData): (...args: any[]) => void => {
            console.log("a user disconnected");
            return () => {
                const disconnectedUser = this.userList.find(userObject => userObject.socketId === socket.id);
                if (disconnectedUser) {
                    this.userList.splice(this.userList.indexOf(disconnectedUser), 1);
                    socket.broadcast.to(data.editorId).emit('updateUserList', this.userList);
                }
            }
        }
        return handler(data);
    }

    public listen() {
        this.server.listen(this.port, () => {
            console.log('socket server running on', this.port);
        });
    }
}

export default SocketServer;

// DEAD CODE ******

/** This code was used for testing socket connection
 * /
// TEST
// socket.on('message', (data) => {
//     console.log(data);
//     socket.send('received, thank you!');
//     this.io.emit('message', data);
// });

/**
 * Initially, I used separate handler for user Connection and room connection
 * now that I have combined them together to avoid asynchronous bugs, this code
 * is no longer needed
 */
// handle user
// socket.on('newUser', (name) => {
//     console.log('****received new user name****', name);
//     this.userList.push({ "name": name, socketId: socket.id });
//     console.log("updated this.userList", this.userList);
//     socket.broadcast.to(data.editorId).emit("userListUpdated", this.userList);
//     console.log("emitted upated list to the front end!");
// });
