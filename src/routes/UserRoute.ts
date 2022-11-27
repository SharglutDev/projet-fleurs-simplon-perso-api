import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/authenticate';

const userRouter = Router();

const userController = new UserController();

userRouter.post('/signup', (req, res) =>
  userController.signUpNewUser(req, res)
);
userRouter.post('/login', (req, res) => userController.logInUser(req, res));

userRouter.get('/all', authenticate, (req, res) =>
  userController.getAllUsers(req, res)
);

userRouter.get('/token', (req, res) => userController.getOneUser(req, res));

userRouter.delete('/:id', (req, res) => userController.deleteOneUser(req, res));

export default userRouter;
