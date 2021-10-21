import express from 'express';
import morgan from 'morgan';
import rootRouter from './router/rootRouter';
import userRouter from './router/userRouter';
import videoRouter from './router/videoRouter';

const app = express();
const logger = morgan('dev');

app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'pug');
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

export default app;
