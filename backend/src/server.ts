import App from './app';
import UserController from './resources/user/user.controller';

const controllers = [new UserController()];
const app = new App(controllers, 8000);


app.listen();