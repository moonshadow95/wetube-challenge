import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import rootRouter from './router/rootRouter';
import userRouter from './router/userRouter';
import videoRouter from './router/videoRouter';
import { localsMiddleware } from './middlewares';

const app = express();
const logger = morgan('dev');

app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'pug');
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret!', resave: true, saveUninitialized: true }));
app.use(localsMiddleware);

app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

export default app;
