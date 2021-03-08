import { Router } from 'express';
import multer from 'multer';

import ensureAuthenticated from './middlewares/ensureAuthenticated';
import uploadConfig from './config/upload';

import UpdatePasswordController from './controllers/UpdatePasswordController';
import OrphanagesController from './controllers/OrphanagesController';
import UsersController from './controllers/UsersController';

const routes = Router();
const upload = multer(uploadConfig);

const usersController = new UsersController();
const orphanagesController = new OrphanagesController();
const updatePasswordController = new UpdatePasswordController();

//MVC
// Model - 
// View - 
// Controllers - 

routes.post('/users', usersController.register);
routes.post('/login', usersController.login);
routes.post('/reset', updatePasswordController.updatePassword);
routes.post('/forgot', updatePasswordController.sendForgotPasswordEmail);

routes.get('/orphanages', ensureAuthenticated, orphanagesController.index);
routes.get('/orphanages/:id', ensureAuthenticated, orphanagesController.show);
routes.post('/orphanages', ensureAuthenticated, upload.array('images'), orphanagesController.create);
routes.patch('/orphanages/:id', ensureAuthenticated, orphanagesController.update);

export default routes;