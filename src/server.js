import express from 'express';
import rootRouter from './router/rootRouter';
import userRouter from './router/userRouter';
import videoRouter from './router/videoRouter';

const app = express();

app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'pug');

app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

export default app;
