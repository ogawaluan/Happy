import { Router } from 'express';
import multer from 'multer';

import ensureAuthenticated from './middlewares/ensureAuthenticated';
import uploadConfig from './config/upload';
import OrphanagesController from './controllers/OrphanagesController';
import UsersController from './controllers/UsersController';

const routes = Router();
const upload = multer(uploadConfig);

const usersController = new UsersController();
const orphanagesController = new OrphanagesController();

//MVC
// Model - 
// View - 
// Controllers - 

routes.post('/users', usersController.register);
routes.post('/login', usersController.login);

routes.get('/orphanages', ensureAuthenticated, orphanagesController.index);
routes.get('/orphanages/:id', ensureAuthenticated, orphanagesController.show);
routes.post('/orphanages', ensureAuthenticated, upload.array('images'), orphanagesController.create);

export default routes;