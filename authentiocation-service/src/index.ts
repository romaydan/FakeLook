import express from 'express';
import settings from './settings';
import flAuthRotuer from './routers/fakelook.auth.router';
import googleAuthRouter from './routers/google.auth.router';
import fbAuthRouter from './routers/facebook.auth.router';
import jwtValidationRouter from './routers/jwt.router';
import cors from 'cors';
import container from './ioc-container';
import cookieParser from 'cookie-parser';
import { Sequelize } from 'sequelize-typescript';
import { TYPES } from './ioc-container/types';

const PORT = process.env.PORT || settings.PORT;
const app = express();

const db = container.get<Sequelize>(TYPES.Sequelize);

db.sync({ force: true })
    .then(() => {
        app.use(cors());
        app.use(express.json())
        app.use(cookieParser())
        app.use(express.urlencoded({ extended: true }))

        app.use('/auth/fakelook', flAuthRotuer);
        app.use('/auth/google', googleAuthRouter);
        app.use('/auth/facebook', fbAuthRouter);
        app.use('/auth', jwtValidationRouter);

        app.listen(PORT, () => {
            console.log(`listening on port ${PORT}...`);
        });
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });