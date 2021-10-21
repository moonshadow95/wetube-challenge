import express from 'express';
import {
  logout,
  userProfile,
  getEditProfile,
  postEditProfile,
} from '../controller/userController';
import { protectorMiddleware } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/logout', protectorMiddleware, logout);
userRouter
  .route('/edit')
  .all(protectorMiddleware)
  .get(getEditProfile)
  .post(postEditProfile);
userRouter.get('/:id', userProfile);

export default userRouter;
