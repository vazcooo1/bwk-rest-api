import express from 'express';
import bodyParser from 'body-parser';
import { apiRoutes } from './routes';
import cors from 'cors';
import authRouter from './auth/authApp';


const app = express();

// Add body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add CORS middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use('/auth', authRouter);
app.use(express.json());
app.use('/api', apiRoutes);

export default app;