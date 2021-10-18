import express from 'express';

const userRouter = express.Router();

userRouter.get('/logout');
userRouter.route('/edit').get().post();
userRouter.get('/:id');

export default userRouter;
