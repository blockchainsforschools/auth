import { createServer } from 'http';
import app from './app';
import { PORT } from './constants';

const server = createServer(app);
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
