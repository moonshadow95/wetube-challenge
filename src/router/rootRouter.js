import express from 'express';
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from '../controller/userController';
import { search } from '../controller/videoController';

const rootRouter = express.Router();

rootRouter.get('/');
rootRouter.route('/join').get(getJoin).post(postJoin);
rootRouter.route('/login').get(getLogin).post(postLogin);
rootRouter.get('/search', search);

export default rootRouter;
