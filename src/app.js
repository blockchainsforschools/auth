import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { COOKIE_SECRET } from './constants';
import apolloServer from './graphql';
import jwtValidator from './middleware/jwtValidator';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));
app.use(jwtValidator);

apolloServer.applyMiddleware({ app, cors: false });

export default app;
