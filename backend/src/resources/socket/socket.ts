import { Server } from 'http';
import { Server as WebSocketServer, Socket } from 'socket.io';
import { findByIdAndUpdate, findOrCreateEditor } from '../editor/editor.methods';
import { emit } from 'process';
import Guest from '../user/guest.interface';

class SocketServer {
    public io: WebSocketServer;
    public port = 9999;
    public server: Server;

    constructor(server: Server) {
        this.port = 9999;
        this.server = server;
        this.io = new WebSocketServer(this.server, {
            cors: {
                origin: '*'
            }
        });
        const userList: Guest[] = [];
        this.io.on('connection', (socket: Socket) => {
            console.log('user connected', socket.id);
            console.log('socket.id type', typeof (socket.id));
            // TEST
            // socket.on('message', (data) => {
            //     console.log(data);
            //     socket.send('received, thank you!');
            //     this.io.emit('message', data);
            // });

            socket.on('newUser', async (data) => {
                console.log('received edtior id, new user joining', data.editorId);

                socket.join(data.editorId);

                const editor = await findOrCreateEditor(data.editorId);

                if (editor) {
                    console.log("emit the editor onto the frontend", editor);
                    userList.push({ name: data.name, socketId: socket.id });
                    socket.emit("receiveEditor", {editorData: editor.data, userList:userList});
                    console.log("updated userList", userList);
                    socket.broadcast.to(data.editorId).emit("updateUserList", userList);
                    console.log("emitted upated list to the front end!");
                }

                // handle user
                // socket.on('newUser', (name) => {
                //     console.log('****received new user name****', name);
                //     userList.push({ "name": name, socketId: socket.id });
                //     console.log("updated userList", userList);
                //     socket.broadcast.to(data.editorId).emit("userListUpdated", userList);
                //     console.log("emitted upated list to the front end!");
                // });

                // handle user disconnecting
                socket.on('disconnect', () => {
                    console.log("a user disconnected");
                    const disconnectedUser = userList.find(userObject => userObject.socketId === socket.id);
                    if (disconnectedUser) {
                        userList.splice(userList.indexOf(disconnectedUser), 1);
                        socket.broadcast.to(data.editorId).emit('updateUserList', userList);
                    }
                })

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

    public listen() {
        this.server.listen(this.port, () => {
            console.log('socket server running on', this.port);
        });
    }
}

export default SocketServer;
