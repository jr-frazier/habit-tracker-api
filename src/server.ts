import express from 'express';
import authRoutes from './routes/authRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import habitRoutes from './routes/habitRoutes.ts';
import testRoute from './routes/testRoute.ts';
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import {isTest} from "../env.ts";
import {APIError, errorHandler} from "./middleware/errorHandler.ts";

const app = express();
app.use(helmet())
app.use(cors())
app.use(express.json()) // needed for parsing JSON bodies
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev', {
    skip: (req, res) => isTest(),
}))

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
})

app.use('/api/auth', authRoutes );
app.use('/api/users', userRoutes );
app.use('/api/habits', habitRoutes );
app.use('/api/test', testRoute)
app.use(errorHandler)

export default app;