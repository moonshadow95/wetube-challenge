import express from 'express';

const PORT = 4000;

const app = express();

const handleListening = () => console.log(`✅ Server Listening on ${PORT}`);

app.listen(PORT, handleListening);
