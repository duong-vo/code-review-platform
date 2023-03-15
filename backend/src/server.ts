import App from './app';
import UserController from './resources/user/user.controller';
import SocketController from './resources/socket/socket.controller';
import SocketServer from './resources/socket/socket';

const controllers = [new UserController(), new SocketController()];
const app:App = new App(controllers, 8080);
const server = new SocketServer(app.server);

server.listen();