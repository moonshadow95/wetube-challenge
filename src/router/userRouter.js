import express from 'express';
import {
  logout,
  userProfile,
  getEditProfile,
  postEditProfile,
} from '../controller/userController';

const userRouter = express.Router();

userRouter.get('/logout', logout);
userRouter.route('/edit').get(getEditProfile).post(postEditProfile);
userRouter.get('/:id', userProfile);

export default userRouter;
