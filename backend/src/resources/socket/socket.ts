import { Server } from 'http';
import { Server as WebSocketServer, Socket } from 'socket.io';
import { findByIdAndUpdate, findOrCreateEditor } from '../editor/editor.methods';
import { emit } from 'process';


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

        this.io.on('connection', (socket: Socket) => {
            console.log('user connected', socket.id);
            // test socket io emit
            //socket.emit('messageResponse', "hi mom")
            // testing
            socket.on('message', (data) => {
                console.log(data);
                socket.send('received, thank you!');
                this.io.emit('message', data);
            });


            // new user join the editor
            socket.on('joinEditor', async (editorId) => {
                console.log('received edtior id, new user joining', editorId);
                
                socket.join(editorId);
                
            
                const editor = await findOrCreateEditor(editorId);
                
                if (editor) {
                    console.log("emit the editor onto the frontend", editor);
                    socket.emit("loadEditor", editor.data);
                }

                // handle user
                socket.on('newUser', (name) => {
                    console.log('received new user name', name);
                    socket.broadcast.to(editorId).emit("userConnected", name);
                });

                socket.on('saveEditor', async (editorContent) => {
                    // console.log("received save editor", editorContent);
                    await findByIdAndUpdate(editorId, editorContent);
                })
       
                // handle editor change
                socket.on('sendEditorChange', (value) => {
                    console.log("received value on the backend", value);
                    socket.broadcast.to(editorId).emit("editorChanged", value);
                    console.log("emitted to the front end", value);
                })
    
                // handle select language
                socket.on('sendLanguageSelect', (language) => {
                    console.log('received new language', language);
                    socket.broadcast.emit('languageSelect', language);
                })
            })

        });

        this.io.on('error', (err: any) => {
            console.log('Socket server error:', err);
        })
    }

    private handleEditorChange() {}

    public listen() {
        this.server.listen(this.port, () => {
            console.log('socket server running on', this.port);
        });
    }
}

export default SocketServer;
