import './db';
import './models/Video';
import app from './server';

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`✅ Server Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
