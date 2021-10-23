import express from 'express';
import {
  logout,
  userProfile,
  getEditProfile,
  postEditProfile,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from '../controller/userController';
import { protectorMiddleware, publicOnlyMiddleware } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/logout', protectorMiddleware, logout);
userRouter
  .route('/edit')
  .all(protectorMiddleware)
  .get(getEditProfile)
  .post(postEditProfile);
userRouter
  .route('/change-password')
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
userRouter.get('/:id', userProfile);

export default userRouter;
