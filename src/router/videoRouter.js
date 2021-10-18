import express from 'express';

const videoRouter = express.Router();

videoRouter.get('/:id([0-9a-f]{24})');
videoRouter.route('/:id([0-9a-f]{24})/edit').get().post();
videoRouter.get('/:id([0-9a-f]{24})/delete');
videoRouter.route('/:id([0-9a-f]{24})/upload').get().post();

export default videoRouter;
