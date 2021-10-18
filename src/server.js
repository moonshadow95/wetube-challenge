import express from 'express';
import rootRouter from './router/rootRouter';
import userRouter from './router/userRouter';
import videoRouter from './router/videoRouter';

const PORT = 4000;

const app = express();

const handleListening = () => console.log(`✅ Server Listening on ${PORT}`);

app.listen(PORT, handleListening);

app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

export default app;
